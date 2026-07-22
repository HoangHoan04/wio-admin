import BaseView from "@/components/layout/BaseView";
import { FormCustom, type FormField } from "@/components/layout/FormCustom";
import { useNavigate } from "react-router-dom";

export default function DomainConfigPage() {
  const navigate = useNavigate();

  const fields: FormField[] = [
    {
      name: "rootDomain",
      label: "Root Domain chính",
      type: "input",
      placeholder: "tiemcuoitanthoi.vn",
      col: 6,
    },
    {
      name: "serverIp",
      label: "IP Server DNS A Record",
      type: "input",
      placeholder: "103.1.2.3",
      col: 6,
    },
    {
      name: "cnameRecord",
      label: "CNAME Target",
      type: "input",
      placeholder: "custom.tiemcuoitanthoi.vn",
      col: 12,
    },
  ];

  return (
    <BaseView>
      <div className="p-6">
        <FormCustom
          title="Cấu hình Tên miền & Domain Custom"
          fields={fields}
          onSubmit={(vals: Record<string, any>) => {
            console.log("Save domain config:", vals);
            navigate(-1);
          }}
          onCancel={() => navigate(-1)}
          submitText="Lưu tên miền"
          cancelText="Hủy bỏ"
        />
      </div>
    </BaseView>
  );
}
