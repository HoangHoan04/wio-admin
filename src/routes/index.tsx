import { ROUTES } from "@/common/constants";
import AppLayout from "@/layout/AppLayout";
import AnalyticsPage from "@/pages/main/analytics-manager";
import CustomerManagerPage from "@/pages/main/customer-manager";
import DetailCustomerPage from "@/pages/main/customer-manager/detail";
import GuestManagerPage from "@/pages/main/guest-manager";
import HomePage from "@/pages/main/home";
import InvitationListPage from "@/pages/main/invitation-manager";
import DetailInvitationPage from "@/pages/main/invitation-manager/detail";
import MusicBackgroundManagerPage from "@/pages/main/music-background-manager";
import PhotoWallManagerPage from "@/pages/main/photo-wall-manager";
import PlanManagerPage from "@/pages/main/plan-manager";
import AddPlanPage from "@/pages/main/plan-manager/add";
import DetailPlanPage from "@/pages/main/plan-manager/detail";
import EditPlanPage from "@/pages/main/plan-manager/edit";
import ReviewManagerPage from "@/pages/main/review-manager";
import SettingsPage from "@/pages/main/setting-system";
import AuditLogPage from "@/pages/main/setting-system/audit-log";
import NotificationLogPage from "@/pages/main/setting-system/notification-log";
import StockAssetManagerPage from "@/pages/main/stock-asset-manager";
import SubscriptionListPage from "@/pages/main/subscription-manager";
import DetailSubscriptionPage from "@/pages/main/subscription-manager/detail";
import ContactManagerPage from "@/pages/main/contact-manager";
import DetailContactPage from "@/pages/main/contact-manager/detail";
import TemplateCategoryManagerPage from "@/pages/main/template-category-manager";
import TemplateManagerPage from "@/pages/main/template-manager";
import AddTemplatePage from "@/pages/main/template-manager/add";
import DetailTemplatePage from "@/pages/main/template-manager/detail";
import EditTemplatePage from "@/pages/main/template-manager/edit";
import WishManagerPage from "@/pages/main/wish-manager";
import LoginPage from "@/pages/auth/LoginPage";
import NotFound from "@/pages/other/NotFound";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />

            {/* Quản lý khách hàng */}
            <Route
              path={ROUTES.MAIN.CUSTOMER_MANAGER.path}
              element={<CustomerManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.CUSTOMER_MANAGER.children.DETAIL_CUSTOMER.path}
              element={<DetailCustomerPage />}
            />

            {/* Quản lý thiệp */}
            <Route
              path={ROUTES.MAIN.INVITATION_MANAGER.path}
              element={<InvitationListPage />}
            />
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.INVITATION_LIST.path
              }
              element={<InvitationListPage />}
            />
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.INVITATION_LIST.children
                  .DETAIL_INVITATION.path
              }
              element={<DetailInvitationPage />}
            />

            {/* Mẫu thiệp */}
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_MANAGER.path
              }
              element={<TemplateManagerPage />}
            />
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_MANAGER
                  .children.ADD_TEMPLATE.path
              }
              element={<AddTemplatePage />}
            />
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_MANAGER
                  .children.EDIT_TEMPLATE.path
              }
              element={<EditTemplatePage />}
            />
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_MANAGER
                  .children.DETAIL_TEMPLATE.path
              }
              element={<DetailTemplatePage />}
            />

            {/* Phong cách cưới */}
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_CATEGORY_MANAGER
                  .path
              }
              element={<TemplateCategoryManagerPage />}
            />

            {/* Tường ảnh */}
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.PHOTO_WALL_MANAGER.path
              }
              element={<PhotoWallManagerPage />}
            />

            {/* Âm nhạc nền */}
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.MUSIC_BACKGROUND_MANAGER
                  .path
              }
              element={<MusicBackgroundManagerPage />}
            />

            {/* Kho sticker & họa tiết */}
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.STOCK_ASSET_MANAGER.path
              }
              element={<StockAssetManagerPage />}
            />

            {/* Khách mời */}
            <Route
              path={ROUTES.MAIN.INVITATION_MANAGER.children.GUEST_MANAGER.path}
              element={<GuestManagerPage />}
            />

            {/* Kiểm duyệt lời chúc */}
            <Route
              path={
                ROUTES.MAIN.INVITATION_MANAGER.children.MODERATION_QUEUE.path
              }
              element={<WishManagerPage />}
            />

            {/* Gói dịch vụ & Thuê bao */}
            <Route
              path={ROUTES.MAIN.SUBSCRIPTION_MANAGER.path}
              element={<SubscriptionListPage />}
            />
            <Route
              path={ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.PLAN_MANAGER.path}
              element={<PlanManagerPage />}
            />
            <Route
              path={
                ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.PLAN_MANAGER.children
                  .ADD_PLAN.path
              }
              element={<AddPlanPage />}
            />
            <Route
              path={
                ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.PLAN_MANAGER.children
                  .EDIT_PLAN.path
              }
              element={<EditPlanPage />}
            />
            <Route
              path={
                ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.PLAN_MANAGER.children
                  .DETAIL_PLAN.path
              }
              element={<DetailPlanPage />}
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

            {/* Đánh giá khách hàng */}
            <Route
              path={ROUTES.MAIN.REVIEW_MANAGER.path}
              element={<ReviewManagerPage />}
            />

            {/* Yêu cầu liên hệ */}
            <Route
              path={ROUTES.MAIN.CONTACT_MANAGER.path}
              element={<ContactManagerPage />}
            />
            <Route
              path={
                ROUTES.MAIN.CONTACT_MANAGER.children.DETAIL_CONTACT.path
              }
              element={<DetailContactPage />}
            />

            {/* Thống kê */}
            <Route
              path={ROUTES.MAIN.ANALYTICS.path}
              element={<AnalyticsPage />}
            />

            {/* Cài đặt */}
            <Route
              path={ROUTES.MAIN.SETTINGS.path}
              element={<SettingsPage />}
            />
            <Route
              path={ROUTES.MAIN.SETTINGS.children.AUDIT_LOG.path}
              element={<AuditLogPage />}
            />
            <Route
              path={ROUTES.MAIN.SETTINGS.children.NOTIFICATION_LOG.path}
              element={<NotificationLogPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
