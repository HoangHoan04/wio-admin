import { enumData } from "@/common/enums";
import BaseView from "@/components/layout/BaseView";
import { type FormField, FormCustom } from "@/components/layout/FormCustom";
import type { TemplateDto } from "@/dto";
import { useCreateTemplate } from "@/hooks/template";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

function AddTemplatePage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới mẫu thiệp",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: TemplateDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTemplate } = useCreateTemplate();
  const router = useRouter();

  const transformedInitData = useMemo(() => {
    const base = {
      isShow: false,
      isPremium: false,
      trialDays: 0,
      description: "",
      minPlan: "",
    };
    if (!initData) return base;
    return {
      ...base,
      ...initData,
      tags: Array.isArray(initData.tags)
        ? initData.tags.join(", ")
        : initData.tags || "",
      trialDays: initData.trialDays ?? 0,
      isShow: initData.isShow ?? false,
      isPremium: initData.isPremium ?? false,
    };
  }, [initData]);

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "name",
        label: "Tên template",
        type: "input",
        required: true,
        placeholder: "Nhập tên template",
        maxLength: 255,
      },
      {
        name: "themeCode",
        label: "Mã theme",
        type: "select",
        required: true,
        options: Object.values(enumData.THEME_CODE || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        placeholder: "Chọn mã theme",
      },
      {
        name: "minPlan",
        label: "Gói tối thiểu",
        type: "input",
        required: true,
        placeholder: "Nhập gói tối thiểu",
      },
      {
        name: "trialDays",
        label: "Số ngày dùng thử",
        type: "number",
        required: true,
        placeholder: "Nhập số ngày dùng thử",
        min: 0,
      },
      {
        name: "isShow",
        label: "Hiển thị",
        type: "checkbox",
      },
      {
        name: "isPremium",
        label: "Premium",
        type: "checkbox",
      },
      {
        name: "tags",
        label: "Tags",
        type: "input",
        placeholder: "Nhập tags, phân cách bằng dấu phẩy",
        gridColumn: "span 3",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: true,
        placeholder: "Nhập mô tả",
        gridColumn: "span 3",
      },
      {
        name: "thumbnailUrl",
        label: "Ảnh thumbnail",
        type: "image",
        isSingle: true,
        gridColumn: "span 3",
      },
    ];
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateTemplate(values);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        showDivider={true}
        fields={formFields}
        initialValues={transformedInitData}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={onCancel || goBack}
        submitText="Lưu"
        cancelText="Hủy"
        gap="20px"
        gridColumns={3}
      />
    </BaseView>
  );
}

export default AddTemplatePage;
