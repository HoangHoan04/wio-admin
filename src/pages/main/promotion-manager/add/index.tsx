import BaseView from "@/components/layout/BaseView";
import { FormCustom, type FormField } from "@/components/layout/FormCustom";
import { useNavigate } from "react-router-dom";

export default function AddPromotionPage() {
  const navigate = useNavigate();

  const fields: FormField[] = [
    {
      name: "code",
      label: "Mã giảm giá (Coupon Code)",
      type: "input",
      placeholder: "VD: KM2026",
      required: true,
      col: 6,
    },
    {
      name: "name",
      label: "Tên chương trình khuyến mãi",
      type: "input",
      placeholder: "Nhập tên chương trình",
      required: true,
      col: 6,
    },
    {
      name: "discountPercent",
      label: "Tỷ lệ giảm (%)",
      type: "number",
      placeholder: "Nhập % giảm",
      required: true,
      col: 6,
    },
    {
      name: "maxDiscountAmount",
      label: "Số tiền giảm tối đa (VNĐ)",
      type: "number",
      placeholder: "Nhập số tiền tối đa",
      col: 6,
    },
    {
      name: "usageLimit",
      label: "Giới hạn số lượt dùng",
      type: "number",
      placeholder: "Số lượt dùng tối đa",
      col: 6,
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { id: "ACTIVE", name: "Kích hoạt" },
        { id: "DISABLED", name: "Tắt" },
      ],
      col: 6,
    },
  ];

  const handleSubmit = (values: Record<string, any>) => {
    console.log("Create promotion:", values);
    navigate(-1);
  };

  return (
    <BaseView>
      <div className="p-6">
        <FormCustom
          title="Tạo mã giảm giá mới"
          fields={fields}
          initialValues={{ status: "ACTIVE" }}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitText="Tạo mã giảm giá"
          cancelText="Hủy bỏ"
        />
      </div>
    </BaseView>
  );
}
