import LoadingScreen from "@/components/common/LoadingScreen";
import { useServicePlanDetail, useUpdateServicePlan } from "@/hooks/service-plan";
import { useParams } from "react-router-dom";
import AddPlanPage from "../add";

function EditPlanPage() {
  const { id } = useParams();
  const { data, isLoading } = useServicePlanDetail(id);
  const { onUpdateServicePlan, isLoading: isLoadingUpdate } = useUpdateServicePlan();

  const handleUpdate = (values: any) => {
    onUpdateServicePlan({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <AddPlanPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa gói dịch vụ"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditPlanPage;
