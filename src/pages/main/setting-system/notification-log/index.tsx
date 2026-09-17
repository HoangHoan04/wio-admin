import { formatDateTime } from "@/common/helpers";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Badge } from "@/components/ui/badge";
import { StatusTag } from "@/components/ui/status-tag";
import type {
  FilterNotificationDto,
  NotificationDto,
  PaginationDto,
} from "@/dto";
import { usePaginationNotification } from "@/hooks/notification";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";

const initFilter: FilterNotificationDto = {};

export default function NotificationLogPage() {
  const [filter, setFilter] = useState<FilterNotificationDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterNotificationDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, isLoading, refetch, total } =
    usePaginationNotification(pagination);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "channel",
      label: "Kênh gửi",
      type: "select",
      placeholder: "Tất cả kênh",
      options: [
        { label: "Email", value: "EMAIL" },
        { label: "SMS", value: "SMS" },
        { label: "Zalo", value: "ZALO" },
        { label: "Push", value: "PUSH" },
      ],
      col: 4,
    },
    {
      key: "type",
      label: "Loại thông báo",
      type: "select",
      placeholder: "Tất cả loại",
      options: [
        { label: "Lời mời", value: "INVITE" },
        { label: "Nhắc nhở", value: "REMINDER" },
        { label: "Cảm ơn", value: "THANK_YOU" },
        { label: "Xác nhận RSVP", value: "RSVP_CONFIRM" },
      ],
      col: 4,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Tất cả trạng thái",
      options: [
        { label: "Đã gửi", value: "SENT" },
        { label: "Chờ gửi", value: "PENDING" },
        { label: "Thất bại", value: "FAILED" },
        { label: "Đã hủy", value: "CANCELLED" },
      ],
      col: 4,
    },
  ];

  const columns: TableColumn<NotificationDto>[] = [
    {
      field: "channel",
      header: "Kênh gửi",
      width: 120,
      align: "center",
      body: (row) => {
        switch (row.channel) {
          case "EMAIL":
            return (
              <Badge
                variant="outline"
                className="gap-1 border-blue-500/30 text-blue-600 dark:text-blue-400"
              >
                <Mail className="size-3" /> Email
              </Badge>
            );
          case "SMS":
            return (
              <Badge
                variant="outline"
                className="gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400"
              >
                <Phone className="size-3" /> SMS
              </Badge>
            );
          case "ZALO":
            return (
              <Badge
                variant="outline"
                className="gap-1 border-sky-500/30 text-sky-600 dark:text-sky-400"
              >
                <MessageSquare className="size-3" /> Zalo
              </Badge>
            );
          default:
            return <Badge variant="secondary">{row.channel}</Badge>;
        }
      },
    },
    {
      field: "type",
      header: "Loại",
      width: 140,
      body: (row) => {
        const typeMap: Record<string, string> = {
          INVITE: "Lời mời",
          REMINDER: "Nhắc nhở",
          THANK_YOU: "Lời cảm ơn",
          RSVP_CONFIRM: "Xác nhận RSVP",
        };
        return (
          <span className="font-medium text-sm">
            {typeMap[row.type] || row.type}
          </span>
        );
      },
    },
    {
      field: "subject",
      header: "Tiêu đề / Nội dung",
      width: 320,
      body: (row) => (
        <div className="flex flex-col max-w-[320px]">
          {row.subject && (
            <span className="font-semibold text-xs truncate">
              {row.subject}
            </span>
          )}
          <span className="text-xs text-muted-foreground line-clamp-1">
            {row.content}
          </span>
        </div>
      ),
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 120,
      align: "center",
      body: (row) => {
        const map: Record<
          string,
          {
            label: string;
            severity: "success" | "warning" | "danger" | "secondary";
          }
        > = {
          SENT: { label: "Đã gửi", severity: "success" },
          PENDING: { label: "Chờ gửi", severity: "warning" },
          FAILED: { label: "Thất bại", severity: "danger" },
          CANCELLED: { label: "Đã hủy", severity: "secondary" },
        };
        const st = map[row.status] || {
          label: row.status,
          severity: "warning",
        };
        return <StatusTag value={st.label} severity={st.severity} />;
      },
    },
    {
      field: "scheduledAt",
      header: "Dự kiến gửi",
      width: 150,
      align: "center",
      body: (row) => formatDateTime(row.scheduledAt),
    },
    {
      field: "sentAt",
      header: "Thời gian gửi",
      width: 150,
      align: "center",
      body: (row) => (row.sentAt ? formatDateTime(row.sentAt) : "—"),
    },
  ];

  return (
    <BaseView>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Lịch Sử Gửi Thông Báo
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi toàn bộ thông báo gửi qua Email, SMS, Zalo cho khách mời và
            đám cưới.
          </p>
        </div>

        <FilterCustom
          fields={filterFields}
          filters={filter as Record<string, any>}
          onFiltersChange={(vals: Record<string, any>) =>
            setFilter(vals as FilterNotificationDto)
          }
          onSearch={() => handleSearch(false)}
          onClear={() => handleSearch(true)}
        />

        <TableCustom<NotificationDto>
          data={data}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: Math.floor(pagination.skip / pagination.take) + 1,
            pageSize: pagination.take,
            total,
          }}
          onPageChange={handlePageChange}
          emptyText="Chưa có thông báo nào được ghi nhận"
          toolbar={{
            show: true,
            showRefreshButton: true,
            onRefresh: refetch,
          }}
        />
      </div>
    </BaseView>
  );
}
