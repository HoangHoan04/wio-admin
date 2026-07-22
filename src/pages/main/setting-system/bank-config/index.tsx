import BaseView from "@/components/layout/BaseView";
import { FormCustom, type FormField } from "@/components/layout/FormCustom";
import { useNavigate } from "react-router-dom";

export default function BankConfigPage() {
  const navigate = useNavigate();

  const fields: FormField[] = [
    {
      name: "bankName",
      label: "Tên ngân hàng (VietQR)",
      type: "select",
      options: [
        { id: "MBBANK", name: "MB Bank (Ngân hàng Quân Đội)" },
        { id: "VCB", name: "Vietcombank" },
        { id: "TCB", name: "Techcombank" },
        { id: "VPB", name: "VPBank" },
      ],
      col: 6,
    },
    {
      name: "accountNo",
      label: "Số tài khoản ngân hàng",
      type: "input",
      placeholder: "Nhập STK",
      col: 6,
    },
    {
      name: "accountName",
      label: "Chủ tài khoản (Viết hoa không dấu)",
      type: "input",
      placeholder: "VD: CTY TNHH TIEM CUOI TAN THOI",
      col: 12,
    },
  ];

  return (
    <BaseView>
      <div className="p-6">
        <FormCustom
          title="Cấu hình Tài khoản Ngân hàng Nhận tiền"
          fields={fields}
          onSubmit={(vals: Record<string, any>) => {
            console.log("Save bank config:", vals);
            navigate(-1);
          }}
          onCancel={() => navigate(-1)}
          submitText="Lưu thông tin TK"
          cancelText="Hủy bỏ"
        />
      </div>
    </BaseView>
  );
}
