import BaseView from "@/components/layout/BaseView";
import { FormCustom, type FormField } from "@/components/layout/FormCustom";
import { useNavigate } from "react-router-dom";

export default function AddStaffPage() {
  const navigate = useNavigate();

  const fields: FormField[] = [
    {
      name: "fullName",
      label: "Họ và tên nhân sự",
      type: "input",
      placeholder: "Nhập họ tên",
      required: true,
      col: 6,
    },
    {
      name: "email",
      label: "Email đăng nhập",
      type: "input",
      placeholder: "VD: nhanvien@tiemcuoi.com",
      required: true,
      col: 6,
    },
    {
      name: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập SĐT",
      col: 6,
    },
    {
      name: "role",
      label: "Phân quyền vai trò",
      type: "select",
      options: [
        { id: "SUPER_ADMIN", name: "Super Admin" },
        { id: "SUPPORT_STAFF", name: "Nhân viên hỗ trợ (Support Staff)" },
        { id: "CONTENT_EDITOR", name: "Biên tập viên nội dung (Content Editor)" },
      ],
      required: true,
      col: 6,
    },
    {
      name: "password",
      label: "Mật khẩu ban đầu",
      type: "input",
      placeholder: "Nhập mật khẩu",
      required: true,
      col: 6,
    },
  ];

  const handleSubmit = (values: Record<string, any>) => {
    console.log("Create staff:", values);
    navigate(-1);
  };

  return (
    <BaseView>
      <div className="p-6">
        <FormCustom
          title="Thêm tài khoản nhân sự mới"
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitText="Tạo tài khoản"
          cancelText="Hủy bỏ"
        />
      </div>
    </BaseView>
  );
}
