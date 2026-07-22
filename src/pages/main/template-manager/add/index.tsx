import { enumData } from "@/common/enums";
import BaseView from "@/components/layout/BaseView";
import { type FormField, FormCustom } from "@/components/layout/FormCustom";
import type { TemplateDto } from "@/dto";
import { useSelectBoxServicePlan } from "@/hooks/service-plan";
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
  handleUpdate?: (data: TemplateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTemplate } = useCreateTemplate();
  const router = useRouter();

  const { data: plans } = useSelectBoxServicePlan();

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
        options: Object.values(enumData.THEME_CODE || {}).map(
          (item: { code: string; name: string }) => ({
            id: item.code,
            name: item.name,
            value: item.code,
          }),
        ),
        placeholder: "Chọn mã theme",
      },
      {
        name: "minPlanId",
        label: "Gói tối thiểu",
        type: "select",
        required: false,
        options: plans,
        placeholder: "Chọn gói tối thiểu",
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
        name: "isPremium",
        label: "Premium",
        type: "checkbox",
      },
      {
        name: "tags",
        label: "Tags",
        type: "tags",
        placeholder: "Nhập tags, phân cách bằng dấu phẩy",
        gridColumn: "span 3",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
        gridColumn: "span 3",
      },
      {
        name: "features",
        label: "Tính năng nổi bật",
        type: "features",
        placeholder: "Nhập từng tính năng trên một dòng",
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
  }, [plans]);

  const handleSubmit = (values: TemplateDto) => {
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
        initialValues={initData}
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
