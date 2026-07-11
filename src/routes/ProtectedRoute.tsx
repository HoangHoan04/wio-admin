import React from "react";
import { Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  permission: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  return <Outlet />;
};

export default ProtectedRoute;
