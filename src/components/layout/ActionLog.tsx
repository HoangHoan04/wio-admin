import { enumData } from "@/common/enums";
import { formatDateTime } from "@/common/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusTag } from "@/components/ui/status-tag";
import type { ActionLogDto, ActionLogFilterDto, PaginationDto } from "@/dto";
import { usePaginationActionLog } from "@/hooks/action-log";
import { Eye, History } from "lucide-react";
import { useTheme } from "next-themes";
import { memo, useMemo, useState } from "react";
import BaseView from "./BaseView";
import type { PaginationConfig, RowAction, TableColumn } from "./TableCustom";
import TableCustom from "./TableCustom";

interface ActionLogProps {
  entityName: string;
  entityId: string;
  title?: string;
}

function ActionLog({ entityName, entityId, title }: ActionLogProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [pagination, setPagination] = useState<
    PaginationDto<ActionLogFilterDto>
  >({
    skip: 0,
    take: enumData.PAGE.PAGESIZE,
    where: {},
  });

  const [selectedLog, setSelectedLog] = useState<ActionLogDto | null>(null);

  const queryPayload = useMemo(
    () => ({
      ...pagination,
      where: {
        entityId: entityId || "",
        entityName: entityName || "",
      },
    }),
    [pagination, entityId, entityName],
  );

  const { data, total, isLoading } = usePaginationActionLog(queryPayload);

  const columns = useMemo<TableColumn<ActionLogDto>[]>(
    () => [
      {
        field: "createdAt",
        header: "Ngày tạo",
        body: (rowData: ActionLogDto) =>
          formatDateTime(rowData.createdAt, "DD/MM/YYYY HH:mm:ss"),
        style: { width: "160px" },
      },
      {
        field: "updatedAt",
        header: "Ngày cập nhật",
        body: (rowData: ActionLogDto) =>
          formatDateTime(rowData.updatedAt, "DD/MM/YYYY HH:mm:ss"),
        style: { width: "160px" },
      },
      {
        field: "createdByName",
        header: "Người tạo",
        style: { width: "180px" },
      },
      {
        field: "actionType",
        header: "Hành động",
        style: { width: "150px" },
        body: (rowData: ActionLogDto) => {
          const action = Object.values(enumData.ACTION_TYPE).find(
            (item) => item.code === rowData.actionType,
          );
          const label = action?.name || rowData.actionType || "N/A";
          return <StatusTag color={action?.color} value={label} />;
        },
      },
      {
        field: "createdNote",
        header: "Mô tả",
        style: { minWidth: "300px" },
      },
    ],
    [],
  );

  const rowActions = useMemo<RowAction<ActionLogDto>[]>(
    () => [
      {
        key: "view",
        icon: <Eye className="size-3.5" />,
        tooltip: "Xem chi tiết thay đổi",
        severity: "info",
        onClick: (record) => setSelectedLog(record),
      },
    ],
    [],
  );

  const paginationConfig = useMemo<PaginationConfig>(
    () => ({
      total: total || 0,
      current: Math.floor(pagination.skip / pagination.take) + 1,
      pageSize: pagination.take,
      showTotal: true,
    }),
    [total, pagination.skip, pagination.take],
  );

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  if (!entityId) return null;

  return (
    <BaseView>
      <div className="flex h-full flex-col items-center justify-start gap-4">
        <span className="text-center text-lg font-black">
          {title || "Lịch sử thao tác"}
        </span>
        <TableCustom<ActionLogDto>
          data={data || []}
          columns={columns}
          loading={isLoading}
          pagination={paginationConfig}
          onPageChange={handlePageChange}
          stripedRows={true}
          rowActions={rowActions}
          scrollable={true}
          emptyText="Không có lịch sử thao tác"
        />
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-4xl max-w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="size-4" />
              Chi tiết thay đổi dữ liệu
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
              <div
                className={`rounded-lg border p-3 ${
                  isDark
                    ? "border-red-900/40 bg-red-950/10"
                    : "border-red-200 bg-red-50/50"
                }`}
              >
                <h3
                  className={`mb-2 flex items-center gap-2 border-b pb-2 text-sm font-bold ${
                    isDark
                      ? "border-red-900/30 text-red-400"
                      : "border-red-200 text-red-600"
                  }`}
                >
                  <History className="size-4" /> Dữ liệu cũ (oldValue)
                </h3>
                <pre
                  className={`m-0 max-h-96 overflow-auto font-mono text-xs whitespace-pre-wrap ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {selectedLog.oldValue &&
                  Object.keys(selectedLog.oldValue).length > 0
                    ? JSON.stringify(selectedLog.oldValue, null, 2)
                    : "Không có dữ liệu cũ hoặc record được tạo mới."}
                </pre>
              </div>

              <div
                className={`rounded-lg border p-3 ${
                  isDark
                    ? "border-green-900/40 bg-green-950/10"
                    : "border-green-200 bg-green-50/50"
                }`}
              >
                <h3
                  className={`mb-2 flex items-center gap-2 border-b pb-2 text-sm font-bold ${
                    isDark
                      ? "border-green-900/30 text-green-400"
                      : "border-green-200 text-green-600"
                  }`}
                >
                  <History className="size-4" /> Dữ liệu mới (newValue)
                </h3>
                <pre
                  className={`m-0 max-h-96 overflow-auto font-mono text-xs whitespace-pre-wrap ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {selectedLog.newValue &&
                  Object.keys(selectedLog.newValue).length > 0
                    ? JSON.stringify(selectedLog.newValue, null, 2)
                    : "Không có dữ liệu mới cập nhật."}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </BaseView>
  );
}

export default memo(ActionLog);
