import BaseView from "@/components/layout/BaseView";
import { type FormField, FormCustom } from "@/components/layout/FormCustom";
import type { ServicePlanDto } from "@/dto";
import { useCreateServicePlan } from "@/hooks/service-plan";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

function AddPlanPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới gói dịch vụ",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: ServicePlanDto;
  isEdit?: boolean;
  handleUpdate?: (data: ServicePlanDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateServicePlan } = useCreateServicePlan();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "name",
        label: "Tên gói dịch vụ",
        type: "input",
        required: true,
        placeholder: "Nhập tên gói dịch vụ",
        maxLength: 255,
      },
      {
        name: "priceVnd",
        label: "Đơn giá (VNĐ)",
        type: "number",
        required: true,
        placeholder: "Nhập đơn giá VNĐ",
        min: 0,
      },
      {
        name: "durationDays",
        label: "Thời hạn (Ngày)",
        type: "number",
        required: true,
        placeholder: "Nhập số ngày áp dụng",
        min: 1,
      },
      {
        name: "maxGuests",
        label: "Số khách mời tối đa",
        type: "number",
        required: true,
        placeholder: "Nhập số khách tối đa",
        min: 0,
      },
      {
        name: "maxPhotos",
        label: "Số lượng ảnh tối đa",
        type: "number",
        required: true,
        placeholder: "Nhập số lượng ảnh tối đa",
        min: 0,
      },
      {
        name: "maxInvitations",
        label: "Số lượng thiệp tối đa",
        type: "number",
        required: true,
        placeholder: "Nhập số thiệp tối đa",
        min: 1,
      },
      {
        name: "hasAi",
        label: "Tính năng AI",
        type: "checkbox",
      },
      {
        name: "hasAnalytics",
        label: "Thống kê dữ liệu",
        type: "checkbox",
      },
      {
        name: "hasCustomSlug",
        label: "Slug tên miền tùy chỉnh",
        type: "checkbox",
      },
      {
        name: "isActive",
        label: "Hoạt động",
        type: "checkbox",
      },
    ];
  }, []);

  const handleSubmit = (values: ServicePlanDto) => {
    const payload = {
      ...values,
      priceVnd: Number(values.priceVnd || 0),
      durationDays: Number(values.durationDays || 30),
      maxGuests: Number(values.maxGuests || 0),
      maxPhotos: Number(values.maxPhotos || 0),
      maxInvitations: Number(values.maxInvitations || values.maxTemplates || 1),
      hasAi: !!values.hasAi,
      hasAnalytics: !!values.hasAnalytics,
      hasCustomSlug: !!values.hasCustomSlug,
      isActive: values.isActive !== undefined ? !!values.isActive : true,
    };

    if (isEdit && handleUpdate) {
      handleUpdate(payload as ServicePlanDto);
    } else {
      onCreateServicePlan(payload);
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

export default AddPlanPage;
