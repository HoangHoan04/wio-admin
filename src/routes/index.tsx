import { ROUTES } from "@/common/constants";
import AppLayout from "@/layout/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import AnalyticsPage from "@/pages/main/analytics";
import CustomerManagerPage from "@/pages/main/customer-manager";
import DetailCustomerPage from "@/pages/main/customer-manager/detail";
import HomePage from "@/pages/main/home";
import MusicBackgroundManagerPage from "@/pages/main/music-background-manager";
import PhotoWallManagerPage from "@/pages/main/photo-wall-manager";
import AuditLogPage from "@/pages/main/setting-system/audit-log";
import SubscriptionListPage from "@/pages/main/subscription-list";
import DetailSubscriptionPage from "@/pages/main/subscription-list/detail";
import TemplateManagerPage from "@/pages/main/template";
import AddTemplatePage from "@/pages/main/template/add";
import DetailTemplatePage from "@/pages/main/template/detail";
import EditTemplatePage from "@/pages/main/template/edit";
import WeddingListPage from "@/pages/main/wedding-list";
import DetailWeddingPage from "@/pages/main/wedding-list/detail";
import WishManagerPage from "@/pages/main/wish-manager";
import NotFound from "@/pages/other/NotFound";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path={ROUTES.MAIN.CUSTOMER_MANAGER.path}
              element={<CustomerManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.CUSTOMER_MANAGER.children.DETAIL_CUSTOMER.path}
              element={<DetailCustomerPage />}
            />
            <Route
              path={ROUTES.MAIN.WEDDING_MANAGER.children.WEDDING_LIST.path}
              element={<WeddingListPage />}
            />
            <Route
              path={
                ROUTES.MAIN.WEDDING_MANAGER.children.WEDDING_LIST.children
                  .DETAIL_WEDDING.path
              }
              element={<DetailWeddingPage />}
            />
            <Route
              path={ROUTES.MAIN.WEDDING_MANAGER.children.TEMPLATE_MANAGER.path}
              element={<TemplateManagerPage />}
            />
            <Route
              path={
                ROUTES.MAIN.WEDDING_MANAGER.children.TEMPLATE_MANAGER.children
                  .ADD_TEMPLATE.path
              }
              element={<AddTemplatePage />}
            />
            <Route
              path={
                ROUTES.MAIN.WEDDING_MANAGER.children.TEMPLATE_MANAGER.children
                  .EDIT_TEMPLATE.path
              }
              element={<EditTemplatePage />}
            />
            <Route
              path={
                ROUTES.MAIN.WEDDING_MANAGER.children.TEMPLATE_MANAGER.children
                  .DETAIL_TEMPLATE.path
              }
              element={<DetailTemplatePage />}
            />
            <Route
              path={ROUTES.MAIN.WEDDING_MANAGER.children.WISH_MANAGER.path}
              element={<WishManagerPage />}
            />
            <Route
              path={
                ROUTES.MAIN.WEDDING_MANAGER.children.PHOTO_WALL_MANAGER.path
              }
              element={<PhotoWallManagerPage />}
            />
            <Route
              path={
                ROUTES.MAIN.WEDDING_MANAGER.children.MUSIC_BACKGROUND_MANAGER
                  .path
              }
              element={<MusicBackgroundManagerPage />}
            />
            <Route
              path={
                ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.SUBSCRIPTION_LIST.path
              }
              element={<SubscriptionListPage />}
            />
            <Route
              path={
                ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.SUBSCRIPTION_LIST
                  .children.DETAIL_SUBSCRIPTION.path
              }
              element={<DetailSubscriptionPage />}
            />
            <Route
              path={ROUTES.MAIN.ANALYTICS.path}
              element={<AnalyticsPage />}
            />
            <Route path={ROUTES.MAIN.SETTINGS.path} element={<HomePage />} />
            <Route
              path={ROUTES.MAIN.SETTINGS.children.AUDIT_LOG.path}
              element={<AuditLogPage />}
            />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
