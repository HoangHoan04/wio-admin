import LoadingScreen from "@/components/common/LoadingScreen";
import { useTemplateDetail, useUpdateTemplate } from "@/hooks/template";
import { useParams } from "react-router-dom";
import AddTemplatePage from "../add";

function EditTemplatePage() {
  const { id } = useParams();
  const { data, isLoading } = useTemplateDetail(id);
  const { onUpdateTemplate, isLoading: isLoadingUpdate } = useUpdateTemplate();

  const handleUpdate = (values: any) => {
    onUpdateTemplate({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <AddTemplatePage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa mẫu thiệp"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditTemplatePage;
