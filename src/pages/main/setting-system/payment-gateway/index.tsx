import BaseView from "@/components/layout/BaseView";
import { FormCustom, type FormField } from "@/components/layout/FormCustom";
import { useNavigate } from "react-router-dom";

export default function PaymentGatewayPage() {
  const navigate = useNavigate();

  const fields: FormField[] = [
    {
      name: "vnp_TmnCode",
      label: "VNPAY Terminal Code (TMN Code)",
      type: "input",
      placeholder: "Nhập TMN Code",
      col: 6,
    },
    {
      name: "vnp_HashSecret",
      label: "VNPAY Hash Secret",
      type: "input",
      placeholder: "Nhập Hash Secret",
      col: 6,
    },
    {
      name: "momo_PartnerCode",
      label: "MoMo Partner Code",
      type: "input",
      placeholder: "Nhập Partner Code",
      col: 6,
    },
    {
      name: "momo_SecretKey",
      label: "MoMo Secret Key",
      type: "input",
      placeholder: "Nhập Secret Key",
      col: 6,
    },
  ];

  return (
    <BaseView>
      <div className="p-6">
        <FormCustom
          title="Cấu hình Cổng Thanh Toán"
          fields={fields}
          onSubmit={(vals: Record<string, any>) => {
            console.log("Save payment gateway config:", vals);
            navigate(-1);
          }}
          onCancel={() => navigate(-1)}
          submitText="Lưu cấu hình"
          cancelText="Hủy bỏ"
        />
      </div>
    </BaseView>
  );
}
