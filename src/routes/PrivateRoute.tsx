import { ROUTES } from "@/common/constants/routes";
import { useAuthStore } from "@/store/authStore";
import { tokenCache } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasToken = tokenCache.isAuthenticated();

  if (tokenCache.isSessionExpired()) {
    return <Navigate to={ROUTES.AUTH.LOGIN.path} replace />;
  }

  return isAuthenticated || hasToken ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.AUTH.LOGIN.path} replace />
  );
};

export default PrivateRoute;
