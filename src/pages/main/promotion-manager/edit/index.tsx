import BaseView from "@/components/layout/BaseView";
import { FormCustom, type FormField } from "@/components/layout/FormCustom";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPromotionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fields: FormField[] = [
    {
      name: "code",
      label: "Mã giảm giá",
      type: "input",
      placeholder: "VD: KM2026",
      required: true,
      col: 6,
    },
    {
      name: "name",
      label: "Tên chương trình",
      type: "input",
      placeholder: "Nhập tên",
      required: true,
      col: 6,
    },
    {
      name: "discountPercent",
      label: "Tỷ lệ giảm (%)",
      type: "number",
      placeholder: "%",
      required: true,
      col: 6,
    },
    {
      name: "maxDiscountAmount",
      label: "Số tiền giảm tối đa (VNĐ)",
      type: "number",
      placeholder: "Tối đa",
      col: 6,
    },
    {
      name: "usageLimit",
      label: "Lượt dùng tối đa",
      type: "number",
      placeholder: "Giới hạn",
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

  const initialValues = {
    code: "HEU2026",
    name: "Ưu đãi Hè rực rỡ 2026",
    discountPercent: 20,
    maxDiscountAmount: 100000,
    usageLimit: 100,
    status: "ACTIVE",
  };

  const handleSubmit = (values: Record<string, any>) => {
    console.log("Update promotion:", id, values);
    navigate(-1);
  };

  return (
    <BaseView>
      <div className="p-6">
        <FormCustom
          title={`Chỉnh sửa mã giảm giá #${id}`}
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitText="Lưu thay đổi"
          cancelText="Hủy bỏ"
        />
      </div>
    </BaseView>
  );
}
