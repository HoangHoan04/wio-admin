import { ROUTES } from "@/common/constants";
import AppLayout from "@/layout/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import CustomerManagerPage from "@/pages/main/customer-manager";
import DetailCustomerPage from "@/pages/main/customer-manager/detail";
import GuestManagerPage from "@/pages/main/guest-manager";
import HomePage from "@/pages/main/home";
import MusicBackgroundManagerPage from "@/pages/main/music-background-manager";
import PhotoWallManagerPage from "@/pages/main/photo-wall-manager";
import TemplateManagerPage from "@/pages/main/template-manager";
import AddTemplatePage from "@/pages/main/template-manager/add";
import DetailTemplatePage from "@/pages/main/template-manager/detail";
import EditTemplatePage from "@/pages/main/template-manager/edit";
import WeddingListPage from "@/pages/main/wedding-manager";
import DetailWeddingPage from "@/pages/main/wedding-manager/detail";
import WishManagerPage from "@/pages/main/wish-manager";
import PlanManagerPage from "@/pages/main/plan-manager";
import AddPlanPage from "@/pages/main/plan-manager/add";
import DetailPlanPage from "@/pages/main/plan-manager/detail";
import EditPlanPage from "@/pages/main/plan-manager/edit";
import SubscriptionListPage from "@/pages/main/subscription-manager";
import DetailSubscriptionPage from "@/pages/main/subscription-manager/detail";
import TransactionManagerPage from "@/pages/main/transaction-manager";
import DetailTransactionPage from "@/pages/main/transaction-manager/detail";
import RefundRequestPage from "@/pages/main/transaction-manager/refund-request";
import PromotionManagerPage from "@/pages/main/promotion-manager";
import AddPromotionPage from "@/pages/main/promotion-manager/add";
import DetailPromotionPage from "@/pages/main/promotion-manager/detail";
import EditPromotionPage from "@/pages/main/promotion-manager/edit";
import StaffManagerPage from "@/pages/main/staff-manager";
import AddStaffPage from "@/pages/main/staff-manager/add";
import DetailStaffPage from "@/pages/main/staff-manager/detail";
import RolePermissionPage from "@/pages/main/staff-manager/role-permission";
import SupportTicketPage from "@/pages/main/support-ticket";
import DetailTicketPage from "@/pages/main/support-ticket/detail";
import MarketingCmsPage from "@/pages/main/marketing-cms";
import BannerManagerPage from "@/pages/main/marketing-cms/banner";
import BlogManagerPage from "@/pages/main/marketing-cms/blog";
import FaqManagerPage from "@/pages/main/marketing-cms/faq";
import TestimonialManagerPage from "@/pages/main/marketing-cms/testimonial";
import AnalyticsPage from "@/pages/main/analytics-manager";
import ConversionReportPage from "@/pages/main/analytics-manager/conversion";
import RevenueReportPage from "@/pages/main/analytics-manager/revenue";
import TemplateReportPage from "@/pages/main/analytics-manager/template";
import WeddingReportPage from "@/pages/main/analytics-manager/wedding";
import SettingsPage from "@/pages/main/setting-system";
import AuditLogPage from "@/pages/main/setting-system/audit-log";
import BankConfigPage from "@/pages/main/setting-system/bank-config";
import DomainConfigPage from "@/pages/main/setting-system/domain-config";
import NotificationConfigPage from "@/pages/main/setting-system/notification-config";
import PaymentGatewayPage from "@/pages/main/setting-system/payment-gateway";
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

            <Route
              path={ROUTES.MAIN.CUSTOMER_MANAGER.path}
              element={<CustomerManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.CUSTOMER_MANAGER.children.DETAIL_CUSTOMER.path}
              element={<DetailCustomerPage />}
            />

            <Route
              path={ROUTES.MAIN.WEDDING_MANAGER.path}
              element={<WeddingListPage />}
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
              path={ROUTES.MAIN.WEDDING_MANAGER.children.GUEST_MANAGER.path}
              element={<GuestManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.WEDDING_MANAGER.children.MODERATION_QUEUE.path}
              element={<WishManagerPage />}
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
              path={ROUTES.MAIN.SUBSCRIPTION_MANAGER.path}
              element={<SubscriptionListPage />}
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
              path={ROUTES.MAIN.TRANSACTION_MANAGER.path}
              element={<TransactionManagerPage />}
            />
            <Route
              path={
                ROUTES.MAIN.TRANSACTION_MANAGER.children.DETAIL_TRANSACTION.path
              }
              element={<DetailTransactionPage />}
            />
            <Route
              path={
                ROUTES.MAIN.TRANSACTION_MANAGER.children.REFUND_REQUEST.path
              }
              element={<RefundRequestPage />}
            />

            <Route
              path={ROUTES.MAIN.PROMOTION_MANAGER.path}
              element={<PromotionManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.PROMOTION_MANAGER.children.ADD_PROMOTION.path}
              element={<AddPromotionPage />}
            />
            <Route
              path={ROUTES.MAIN.PROMOTION_MANAGER.children.EDIT_PROMOTION.path}
              element={<EditPromotionPage />}
            />
            <Route
              path={
                ROUTES.MAIN.PROMOTION_MANAGER.children.DETAIL_PROMOTION.path
              }
              element={<DetailPromotionPage />}
            />

            <Route
              path={ROUTES.MAIN.STAFF_MANAGER.path}
              element={<StaffManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.STAFF_MANAGER.children.ADD_STAFF.path}
              element={<AddStaffPage />}
            />
            <Route
              path={ROUTES.MAIN.STAFF_MANAGER.children.DETAIL_STAFF.path}
              element={<DetailStaffPage />}
            />
            <Route
              path={ROUTES.MAIN.STAFF_MANAGER.children.ROLE_PERMISSION.path}
              element={<RolePermissionPage />}
            />

            <Route
              path={ROUTES.MAIN.SUPPORT_TICKET.path}
              element={<SupportTicketPage />}
            />
            <Route
              path={ROUTES.MAIN.SUPPORT_TICKET.children.DETAIL_TICKET.path}
              element={<DetailTicketPage />}
            />

            <Route
              path={ROUTES.MAIN.MARKETING_CMS.path}
              element={<MarketingCmsPage />}
            />
            <Route
              path={ROUTES.MAIN.MARKETING_CMS.children.BANNER_MANAGER.path}
              element={<BannerManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.MARKETING_CMS.children.BLOG_MANAGER.path}
              element={<BlogManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.MARKETING_CMS.children.FAQ_MANAGER.path}
              element={<FaqManagerPage />}
            />
            <Route
              path={ROUTES.MAIN.MARKETING_CMS.children.TESTIMONIAL_MANAGER.path}
              element={<TestimonialManagerPage />}
            />

            <Route
              path={ROUTES.MAIN.ANALYTICS.path}
              element={<AnalyticsPage />}
            />
            <Route
              path={ROUTES.MAIN.ANALYTICS.children.REVENUE_REPORT.path}
              element={<RevenueReportPage />}
            />
            <Route
              path={ROUTES.MAIN.ANALYTICS.children.WEDDING_REPORT.path}
              element={<WeddingReportPage />}
            />
            <Route
              path={ROUTES.MAIN.ANALYTICS.children.CONVERSION_REPORT.path}
              element={<ConversionReportPage />}
            />
            <Route
              path={ROUTES.MAIN.ANALYTICS.children.TEMPLATE_REPORT.path}
              element={<TemplateReportPage />}
            />

            <Route
              path={ROUTES.MAIN.SETTINGS.path}
              element={<SettingsPage />}
            />
            <Route
              path={ROUTES.MAIN.SETTINGS.children.AUDIT_LOG.path}
              element={<AuditLogPage />}
            />
            <Route
              path={ROUTES.MAIN.SETTINGS.children.PAYMENT_GATEWAY.path}
              element={<PaymentGatewayPage />}
            />
            <Route
              path={ROUTES.MAIN.SETTINGS.children.NOTIFICATION_CONFIG.path}
              element={<NotificationConfigPage />}
            />
            <Route
              path={ROUTES.MAIN.SETTINGS.children.DOMAIN_CONFIG.path}
              element={<DomainConfigPage />}
            />
            <Route
              path={ROUTES.MAIN.SETTINGS.children.BANK_CONFIG.path}
              element={<BankConfigPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
