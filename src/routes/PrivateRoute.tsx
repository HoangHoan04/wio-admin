import { ROUTES } from "@/common/constants/routes";
import { tokenCache } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  return tokenCache.isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.AUTH.LOGIN.path} replace />
  );
};

export default PrivateRoute;
