import { enumData } from '@/common/enums';
import { formatDateTime } from '@/common/helpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ActionLogDto, ActionLogFilterDto, PaginationDto } from '@/dto';
import { usePaginationActionLog } from '@/hooks/action-log';
import { Eye, History } from 'lucide-react';
import { useState, useMemo, useCallback, memo } from 'react';
import { StatusTag } from '../ui/status-tag';
import BaseView from './BaseView';
import TableCustom, { type TableColumn, type RowAction, type PaginationConfig } from './TableCustom';

/* ============================================================
 * HELPER — Format JSON value an toàn
 * ============================================================ */
function formatJsonValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    return Object.keys(value as object).length > 0;
  }
  return true;
}

/* ============================================================
 * PROPS
 * ============================================================ */
interface ActionLogDetailDialogProps {
  open: boolean;
  log: ActionLogDto | null;
  onClose: () => void;
}

/* ============================================================
 * COMPONENT
 * ============================================================ */
export function ActionLogDetailDialog({
  open,
  log,
  onClose,
}: ActionLogDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-4" />
            Chi tiết thay đổi dữ liệu
          </DialogTitle>
        </DialogHeader>

        {log && (
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            {/* ---- OLD VALUE ---- */}
            <ValuePanel
              title="Dữ liệu cũ"
              subtitle="oldValue"
              value={log.oldValue}
              emptyText="Không có dữ liệu cũ hoặc bản ghi được tạo mới."
              variant="old"
            />

            {/* ---- NEW VALUE ---- */}
            <ValuePanel
              title="Dữ liệu mới"
              subtitle="newValue"
              value={log.newValue}
              emptyText="Không có dữ liệu mới cập nhật."
              variant="new"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * SUB-COMPONENT — Value Panel
 * ============================================================ */
interface ValuePanelProps {
  title: string;
  subtitle: string;
  value: unknown;
  emptyText: string;
  variant: 'old' | 'new';
}

function ValuePanel({
  title,
  subtitle,
  value,
  emptyText,
  variant,
}: ValuePanelProps) {
  const colorClasses =
    variant === 'old'
      ? 'border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/10'
      : 'border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/10';

  const headingClasses =
    variant === 'old'
      ? 'border-red-200 text-red-600 dark:border-red-900/30 dark:text-red-400'
      : 'border-green-200 text-green-600 dark:border-green-900/30 dark:text-green-400';

  const hasValue = hasContent(value);

  return (
    <div className={`rounded-lg border p-3 ${colorClasses}`}>
      <h3
        className={`mb-2 flex items-center gap-2 border-b pb-2 text-sm font-bold ${headingClasses}`}
      >
        <Eye className="size-4" />
        {title}{' '}
        <span className="font-mono text-xs opacity-60">({subtitle})</span>
      </h3>

      <pre className="m-0 max-h-96 overflow-auto font-mono text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300">
        {hasValue
          ? formatJsonValue(value)
          : emptyText}
      </pre>
    </div>
  );
}



/* ============================================================
 * CONSTANTS
 * ============================================================ */
const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';

/** Map action code → enum item — build 1 lần */
const ACTION_TYPE_MAP = new Map<string, any>(
  Object.values(enumData.ACTION_TYPE).map((item) => [item.code, item]),
);

/* ============================================================
 * PROPS
 * ============================================================ */
interface ActionLogProps {
  entityName: string;
  entityId: string;
  title?: string;
}

/* ============================================================
 * COMPONENT
 * ============================================================ */
function ActionLogComponent({ entityName, entityId, title }: ActionLogProps) {
  const [pagination, setPagination] = useState<
    PaginationDto<ActionLogFilterDto>
  >({
    skip: 0,
    take: enumData.PAGE.PAGESIZE,
    where: {},
  });

  const [selectedLog, setSelectedLog] = useState<ActionLogDto | null>(null);

  /* --------------------------------------------------------
   * QUERY PAYLOAD
   * -------------------------------------------------------- */
  const queryPayload = useMemo<PaginationDto<ActionLogFilterDto>>(
    () => ({
      skip: pagination.skip,
      take: pagination.take,
      where: {
        entityId,
        entityName,
      },
    }),
    [pagination.skip, pagination.take, entityId, entityName],
  );

  const { data, total, isLoading } = usePaginationActionLog(queryPayload);

  /* --------------------------------------------------------
   * COLUMNS
   * -------------------------------------------------------- */
  const columns = useMemo<TableColumn<ActionLogDto>[]>(
    () => [
      {
        field: 'createdAt',
        header: 'Ngày tạo',
        style: { width: '160px' },
        body: (row) => formatDateTime(row.createdAt, DATE_FORMAT),
      },
      {
        field: 'updatedAt',
        header: 'Ngày cập nhật',
        style: { width: '160px' },
        body: (row) => formatDateTime(row.updatedAt, DATE_FORMAT),
      },
      {
        field: 'createdByName',
        header: 'Người tạo',
        style: { width: '180px' },
      },
      {
        field: 'actionType',
        header: 'Hành động',
        style: { width: '150px' },
        body: (row) => {
          const action = ACTION_TYPE_MAP.get(row.actionType ?? '');
          return (
            <StatusTag
              color={action?.color}
              value={action?.name ?? row.actionType ?? 'N/A'}
            />
          );
        },
      },
      {
        field: 'createdNote',
        header: 'Mô tả',
        style: { minWidth: '300px' },
      },
    ],
    [],
  );

  /* --------------------------------------------------------
   * ROW ACTIONS
   * -------------------------------------------------------- */
  const handleViewDetail = useCallback((record: ActionLogDto) => {
    setSelectedLog(record);
  }, []);

  const rowActions = useMemo<RowAction<ActionLogDto>[]>(
    () => [
      {
        key: 'view',
        icon: <Eye className="size-3.5" />,
        tooltip: 'Xem chi tiết thay đổi',
        severity: 'info',
        onClick: handleViewDetail,
      },
    ],
    [handleViewDetail],
  );

  /* --------------------------------------------------------
   * PAGINATION
   * -------------------------------------------------------- */
  const paginationConfig = useMemo<PaginationConfig>(
    () => ({
      total,
      current: Math.floor(pagination.skip / pagination.take) + 1,
      pageSize: pagination.take,
      showTotal: true,
    }),
    [total, pagination.skip, pagination.take],
  );

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  }, []);

  const handleCloseDialog = useCallback(() => setSelectedLog(null), []);

  /* --------------------------------------------------------
   * GUARD
   * -------------------------------------------------------- */
  if (!entityId || !entityName) return null;

  /* --------------------------------------------------------
   * RENDER
   * -------------------------------------------------------- */
  return (
    <BaseView>
      <div className="flex h-full flex-col items-center justify-start gap-4">
        <span className="text-center text-lg font-black">
          {title || 'Lịch sử thao tác'}
        </span>

        <TableCustom<ActionLogDto>
          data={data}
          columns={columns}
          loading={isLoading}
          pagination={paginationConfig}
          onPageChange={handlePageChange}
          stripedRows
          rowActions={rowActions}
          scrollable
          emptyText="Không có lịch sử thao tác"
        />
      </div>

      <ActionLogDetailDialog
        open={!!selectedLog}
        log={selectedLog}
        onClose={handleCloseDialog}
      />
    </BaseView>
  );
}

export default memo(ActionLogComponent);