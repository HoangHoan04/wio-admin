import BaseView from "@/components/layout/BaseView";
import { FormCustom, type FormField } from "@/components/layout/FormCustom";
import { useNavigate } from "react-router-dom";

export default function NotificationConfigPage() {
  const navigate = useNavigate();

  const fields: FormField[] = [
    {
      name: "smtpHost",
      label: "SMTP Host",
      type: "input",
      placeholder: "smtp.gmail.com",
      col: 6,
    },
    {
      name: "smtpPort",
      label: "SMTP Port",
      type: "number",
      placeholder: "587",
      col: 6,
    },
    {
      name: "smtpUser",
      label: "SMTP Username / Email",
      type: "input",
      placeholder: "noreply@tiemcuoi.com",
      col: 6,
    },
    {
      name: "smtpPass",
      label: "SMTP Password / App Password",
      type: "input",
      placeholder: "••••••••",
      col: 6,
    },
  ];

  return (
    <BaseView>
      <div className="p-6">
        <FormCustom
          title="Cấu hình Email & Thông báo System"
          fields={fields}
          onSubmit={(vals: Record<string, any>) => {
            console.log("Save notification config:", vals);
            navigate(-1);
          }}
          onCancel={() => navigate(-1)}
          submitText="Lưu thông số"
          cancelText="Hủy bỏ"
        />
      </div>
    </BaseView>
  );
}
