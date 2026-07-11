import { enumData } from "@/common/enums";
import { formatDate, formatDateTime } from "@/common/helpers";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Grid,
  Inbox,
  Loader2,
  Menu,
  RefreshCw,
  Settings,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

export interface TableColumn<T = any> {
  field: string;
  header: string;
  width?: string | number;
  body?: (rowData: T, options: any) => ReactNode;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  filterMatchMode?: string;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  frozen?: boolean;
  alignFrozen?: "left" | "right";
  align?: "left" | "center" | "right";
  hidden?: boolean;
  resizable?: boolean;
  type?:
    | "text"
    | "number"
    | "currency"
    | "date"
    | "datetime"
    | "boolean"
    | "badge"
    | "tag";
  dateFormat?: string;
  currencySymbol?: string;
  numberFormat?: Intl.NumberFormatOptions;
  badgeSeverity?: (
    value: any,
  ) => "success" | "info" | "warning" | "danger" | "secondary";
  tagSeverity?: (
    value: any,
  ) => "success" | "info" | "warning" | "danger" | "secondary";
  renderBoolean?: (value: boolean) => ReactNode;
  renderEmpty?: () => ReactNode;
  render?: (rowData: T) => ReactNode;
}

export interface FilterMeta {
  [field: string]: {
    value: any;
    matchMode?: string;
  };
}

export interface RowAction<T = any> {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  severity?: "secondary" | "success" | "info" | "warning" | "danger" | "help";
  outlined?: boolean;
  text?: boolean;
  onClick?: (record: T, index: number) => void;
  render?: (record: T, index: number) => ReactNode;
  disabled?: boolean | ((record: T) => boolean);
  visible?: boolean | ((record: T) => boolean);
  loading?: boolean | ((record: T) => boolean);
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showTotal?: boolean;
  totalTemplate?: string;
}

export interface ToolbarConfig {
  show?: boolean;
  align?: "left" | "center" | "right" | "between";
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
}

export interface DataTableProps<T = any> {
  id?: string;
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyText?: ReactNode;
  dataKey?: string;
  pagination?: PaginationConfig;
  onPageChange?: (page: number, pageSize: number) => void;
  enableSelection?: boolean;
  showIndexList?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  selectionMode?: "single" | "multiple";
  rowActions?: RowAction<T>[];
  rowActionsWidth?: string | number;
  rowActionsStyle?: React.CSSProperties;
  rowActionsFrozen?: boolean;
  toolbar?: ToolbarConfig;
  stripedRows?: boolean;
  showGridlines?: boolean;
  size?: "small" | "normal" | "large";
  responsiveLayout?: "scroll" | "stack";
  scrollable?: boolean;
  maxHeight?: string;
  virtualScrollerOptions?: any;
  resizableColumns?: boolean;
  reorderableColumns?: boolean;
  rowStyle?: (data: T) => React.CSSProperties;
  onRowClick?: (event: any) => void;
  onRowDoubleClick?: (event: any) => void;
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null;
  onSort?: (event: any) => void;
  filters?: FilterMeta;
  onFilter?: (filters: FilterMeta) => void;
  style?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
}

function TableCustom<T extends Record<string, any>>({
  id = "custom-table",
  data = [],
  columns: initialColumns,
  loading = false,
  emptyText,
  dataKey = "id",
  pagination,
  onPageChange,
  enableSelection = false,
  showIndexList = false,
  selectedRows = [],
  onSelectionChange,
  selectionMode = "multiple",
  rowActions = [],
  rowActionsWidth = "140px",
  rowActionsStyle,
  rowActionsFrozen = true,
  toolbar,
  stripedRows = false,
  showGridlines = true,
  size = "normal",
  onRowClick,
  sortField,
  sortOrder,
  onSort,
  filters: _filters = {},
  onFilter: _onFilter,
  style,
  tableStyle,
}: DataTableProps<T>) {
  const [rows, setRows] = useState(
    pagination?.pageSize || enumData.PAGE.PAGESIZE,
  );

  // States cho tính năng nâng cao
  const [density, setDensity] = useState<"small" | "normal" | "large">(size);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // Load / Save Column Order & Visibility
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${id}_column_order`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return initialColumns.map((c) => c.field);
  });

  const [visibleColumnsMap, setVisibleColumnsMap] = useState<
    Record<string, boolean>
  >(() => {
    const saved = localStorage.getItem(`${id}_column_visibility`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    const initialMap: Record<string, boolean> = {};
    initialColumns.forEach((c) => {
      initialMap[c.field] = c.hidden !== true;
    });
    return initialMap;
  });

  // State cho kích thước cột (Resize)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const resizingRef = useRef<{
    field: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  // Sync columnOrder & visibleColumnsMap when initialColumns change
  useEffect(() => {
    const currentFields = initialColumns.map((c) => c.field);
    setColumnOrder((prev) => {
      const filteredPrev = prev.filter((f) => currentFields.includes(f));
      const added = currentFields.filter((f) => !prev.includes(f));
      const next = [...filteredPrev, ...added];
      localStorage.setItem(`${id}_column_order`, JSON.stringify(next));
      return next;
    });

    setVisibleColumnsMap((prev) => {
      const next = { ...prev };
      initialColumns.forEach((c) => {
        if (next[c.field] === undefined) {
          next[c.field] = c.hidden !== true;
        }
      });
      localStorage.setItem(`${id}_column_visibility`, JSON.stringify(next));
      return next;
    });
  }, [initialColumns, id]);

  useEffect(() => {
    if (pagination) {
      setRows(pagination.pageSize);
    }
  }, [pagination]);

  // Click outside to close column configuration dropdown
  const configRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        configRef.current &&
        !configRef.current.contains(event.target as Node)
      ) {
        setShowConfig(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (page: number) => {
    onPageChange?.(page, rows);
  };

  const handlePageSizeChange = (newSize: number) => {
    setRows(newSize);
    onPageChange?.(1, newSize);
  };

  // Toggle Visibility
  const toggleColumnVisibility = (field: string) => {
    const nextMap = {
      ...visibleColumnsMap,
      [field]: !visibleColumnsMap[field],
    };
    setVisibleColumnsMap(nextMap);
    localStorage.setItem(`${id}_column_visibility`, JSON.stringify(nextMap));
  };

  // Reorder Logic (HTML5 Drag & Drop)
  const handleDragStart = (e: React.DragEvent, field: string) => {
    setDraggedField(field);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, field: string) => {
    if (draggedField && draggedField !== field) {
      e.preventDefault();
    }
  };

  const handleDrop = (targetField: string) => {
    if (!draggedField || draggedField === targetField) return;

    const dragIndex = columnOrder.indexOf(draggedField);
    const dropIndex = columnOrder.indexOf(targetField);

    const newOrder = [...columnOrder];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggedField);

    setColumnOrder(newOrder);
    localStorage.setItem(`${id}_column_order`, JSON.stringify(newOrder));
    setDraggedField(null);
  };

  // Resize Logic
  const handleResizeStart = (
    e: React.MouseEvent,
    field: string,
    initialWidth: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = {
      field,
      startX: e.clientX,
      startWidth: initialWidth,
    };
    document.addEventListener("mousemove", handleResizeActive);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeActive = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    const { field, startX, startWidth } = resizingRef.current;
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + deltaX); // Tối thiểu 50px
    setColumnWidths((prev) => ({
      ...prev,
      [field]: newWidth,
    }));
  };

  const handleResizeEnd = () => {
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleResizeActive);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  // Sắp xếp các cột dựa trên columnOrder và visibleColumnsMap
  const visibleColumns = useMemo(() => {
    const colMap = new Map(initialColumns.map((c) => [c.field, c]));
    const ordered = columnOrder
      .map((field) => colMap.get(field))
      .filter(
        (col): col is TableColumn<T> => !!col && visibleColumnsMap[col.field],
      );

    // Thêm bất kỳ cột nào mới trong initialColumns chưa có trong columnOrder
    initialColumns.forEach((c) => {
      if (!columnOrder.includes(c.field) && visibleColumnsMap[c.field]) {
        ordered.push(c);
      }
    });

    return ordered;
  }, [initialColumns, columnOrder, visibleColumnsMap]);

  // Cắt lát dữ liệu phía client khi số dòng data lớn hơn pageSize
  const displayData = useMemo(() => {
    if (pagination && data.length > rows) {
      const start = (pagination.current - 1) * rows;
      const end = start + rows;
      return data.slice(start, end);
    }
    return data;
  }, [data, pagination, rows]);

  // Tính toán vị trí left cho các cột frozen (Sticky left)
  const leftStickyOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let currentOffset = 0;
    if (enableSelection) currentOffset += 48; // Checkbox column is 48px wide
    if (showIndexList) currentOffset += 56; // STT column is 56px wide

    visibleColumns.forEach((col) => {
      if (col.frozen && col.alignFrozen !== "right") {
        offsets[col.field] = currentOffset;
        const width = columnWidths[col.field] || Number(col.width) || 150;
        currentOffset += width;
      }
    });
    return offsets;
  }, [visibleColumns, columnWidths, enableSelection, showIndexList]);

  const isActionVisible = (action: RowAction<T>, rowData: T) =>
    action.visible === undefined
      ? true
      : typeof action.visible === "function"
        ? action.visible(rowData)
        : action.visible;

  const isActionDisabled = (action: RowAction<T>, rowData: T) =>
    action.disabled === undefined
      ? false
      : typeof action.disabled === "function"
        ? action.disabled(rowData)
        : action.disabled;

  const isActionLoading = (action: RowAction<T>, rowData: T) =>
    action.loading === undefined
      ? false
      : typeof action.loading === "function"
        ? action.loading(rowData)
        : action.loading;

  const getBadgeSeverityClass = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "info":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "warning":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "danger":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "secondary":
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const formatters = {
    date: (value: any, format?: string) => {
      if (!value) return "-";
      if (format === "date") {
        return dayjs(value).format(formatDate(value, "DD/MM/YYYY"));
      }
      if (format === "datetime") {
        return dayjs(value).format(formatDateTime(value, "HH:mm DD/MM/YYYY"));
      }
      return dayjs(value).format(format);
    },
    currency: (value: any, symbol: string = "₫") =>
      value == null
        ? "-"
        : `${Number(value).toLocaleString("vi-VN")} ${symbol}`,
    number: (value: any, options?: Intl.NumberFormatOptions) =>
      value == null ? "-" : Number(value).toLocaleString("vi-VN", options),
    boolean: (value: any, customRender?: (value: boolean) => ReactNode) =>
      customRender ? (
        customRender(value)
      ) : value ? (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Có
        </span>
      ) : (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
          Không
        </span>
      ),
    badge: (
      value: any,
      getSeverity?: (
        value: any,
      ) => "success" | "info" | "warning" | "danger" | "secondary",
    ) => {
      if (!value) return "-";
      const severity = getSeverity ? getSeverity(value) : "info";
      return (
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold border",
            getBadgeSeverityClass(severity),
          )}
        >
          {value}
        </span>
      );
    },
  };

  const renderColumnCell = (col: TableColumn<T>, rowData: T, index: number) => {
    if (col.body) return col.body(rowData, { rowIndex: index });
    if (col.render) return col.render(rowData);
    const value = rowData[col.field];
    if (value == null || value === "")
      return col.renderEmpty ? col.renderEmpty() : "-";
    switch (col.type) {
      case "date":
        return formatters.date(value, col.dateFormat || "date");
      case "datetime":
        return formatters.date(value, col.dateFormat || "datetime");
      case "currency":
        return formatters.currency(value, col.currencySymbol);
      case "number":
        return formatters.number(value, col.numberFormat);
      case "boolean":
        return formatters.boolean(value, col.renderBoolean);
      case "badge":
      case "tag":
        return formatters.badge(value, col.badgeSeverity || col.tagSeverity);
      default:
        return value;
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange?.([...data]);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (rowData: T, checked: boolean) => {
    if (selectionMode === "single") {
      onSelectionChange?.(checked ? [rowData] : []);
    } else {
      if (checked) {
        onSelectionChange?.([...selectedRows, rowData]);
      } else {
        onSelectionChange?.(
          selectedRows.filter((r) => r[dataKey] !== rowData[dataKey]),
        );
      }
    }
  };

  const isRowSelected = (rowData: T) =>
    selectedRows.some((r) => r[dataKey] === rowData[dataKey]);

  const handleSortClick = (field: string, sortable?: boolean) => {
    if (!sortable || !onSort) return;
    let nextOrder: 1 | -1 | 0 = 1;
    if (sortField === field) {
      if (sortOrder === 1) nextOrder = -1;
      else if (sortOrder === -1) nextOrder = 0;
    }
    onSort({
      sortField: nextOrder === 0 ? null : field,
      sortOrder: nextOrder === 0 ? null : nextOrder,
    });
  };

  const getColumnAlign = (col: TableColumn<T>) => {
    if (col.align) return col.align;
    switch (col.type) {
      case "number":
      case "currency":
        return "right";
      case "date":
      case "datetime":
      case "boolean":
      case "badge":
      case "tag":
        return "center";
      default:
        return "left";
    }
  };

  const getJustifyClass = (align?: "left" | "center" | "right") => {
    if (align === "right") return "justify-end";
    if (align === "center") return "justify-center";
    return "justify-start";
  };

  const getToolbarJustify = () => {
    switch (toolbar?.align) {
      case "left":
        return "justify-start";
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      case "between":
      default:
        return "justify-between";
    }
  };

  // Density padding classes
  const densityCellPadding = (() => {
    switch (density) {
      case "small":
        return "py-2 px-3 text-xs";
      case "large":
        return "py-5 px-6 text-base";
      case "normal":
      default:
        return "py-3.5 px-4.5 text-sm";
    }
  })();

  return (
    <div className="w-full text-sm text-foreground" style={style}>
      {/* TOOLBAR */}
      <div
        className={cn(
          "flex items-center gap-3 mb-3 p-1 flex-wrap justify-between",
          toolbar?.show ? getToolbarJustify() : "justify-end",
        )}
      >
        <div className="flex items-center gap-3">
          {toolbar?.show && toolbar.leftContent}
        </div>

        <div className="flex items-center gap-2">
          {toolbar?.show && toolbar.rightContent}

          {/* DENSITY SELECTOR */}
          <div className="flex items-center gap-1 bg-muted/65 p-0.5 rounded-lg border border-border">
            <Button
              variant={density === "small" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-14 rounded-md p-0"
              onClick={() => setDensity("small")}
              title="Xem thu gọn"
            >
              <span className="text-[10px] font-bold">Mini</span>
            </Button>
            <Button
              variant={density === "normal" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-14 rounded-md p-0"
              onClick={() => setDensity("normal")}
              title="Xem vừa phải"
            >
              <span className="text-xs font-bold">Normal</span>
            </Button>
            <Button
              variant={density === "large" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-14 rounded-md p-0"
              onClick={() => setDensity("large")}
              title="Xem rộng rãi"
            >
              <span className="text-sm font-bold">Big</span>
            </Button>
          </div>

          {/* REFRESH BUTTON */}
          {toolbar?.show && toolbar.showRefreshButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={toolbar.onRefresh}
              disabled={loading}
              title={"Làm mới"}
              className="h-8 w-8"
            >
              <RefreshCw size={14} />
            </Button>
          )}

          {/* COLUMN CONFIG COG */}
          <div className="relative" ref={configRef}>
            <Button
              variant="outline"
              size="icon"
              className={cn("h-8 w-8", showConfig && "bg-muted")}
              onClick={() => setShowConfig(!showConfig)}
              title="Cài đặt hiển thị cột"
            >
              <Settings size={14} />
            </Button>

            {showConfig && (
              <div className="absolute right-0 mt-1.5 w-56 bg-card border border-border rounded-lg shadow-lg z-50 p-2 max-h-80 overflow-y-auto">
                <div className="text-xs font-semibold px-2 py-1.5 border-b border-border mb-1.5 text-muted-foreground flex items-center gap-1.5">
                  <Grid size={12} />
                  Hiển thị cột
                </div>
                {initialColumns.map((col) => (
                  <label
                    key={col.field}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/60 rounded-md cursor-pointer text-xs font-medium text-foreground select-none"
                  >
                    <input
                      type="checkbox"
                      checked={!!visibleColumnsMap[col.field]}
                      onChange={() => toggleColumnVisibility(col.field)}
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>{col.header}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-card text-card-foreground shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]">
        <table
          className={cn(
            "w-full border-collapse table-layout-fixed",
            showGridlines && "divide-y divide-border/60",
          )}
          style={tableStyle}
        >
          <thead>
            <tr className="border-b border-border bg-muted/65">
              {/* Checkbox Header */}
              {enableSelection && (
                <th
                  className={cn(
                    "w-12 text-center select-none border-r border-border/60 bg-background/30 z-20 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)]",
                    densityCellPadding,
                  )}
                  style={{
                    position: "sticky",
                    left: 0,
                    transform: "translate3d(0,0,0)",
                  }}
                >
                  {selectionMode === "multiple" && (
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          data.length > 0 && selectedRows.length === data.length
                        }
                        className="rounded-sm border-border bg-transparent text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      />
                    </div>
                  )}
                </th>
              )}

              {/* STT Header */}
              {showIndexList && (
                <th
                  className={cn(
                    "w-14 text-center select-none border-r border-border/60 bg-background/30 z-20 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)]",
                    densityCellPadding,
                  )}
                  style={{
                    position: "sticky",
                    left: enableSelection ? 48 : 0,
                    transform: "translate3d(0,0,0)",
                  }}
                >
                  STT
                </th>
              )}

              {/* Data Headers */}
              {visibleColumns.map((col) => {
                const isLeftFrozen = col.frozen && col.alignFrozen !== "right";
                const width =
                  columnWidths[col.field] || Number(col.width) || 150;

                return (
                  <th
                    key={col.field}
                    draggable
                    onDragStart={(e) => handleDragStart(e, col.field)}
                    onDragOver={(e) => handleDragOver(e, col.field)}
                    onDrop={() => handleDrop(col.field)}
                    onClick={() => handleSortClick(col.field, col.sortable)}
                    style={{
                      width,
                      textAlign: getColumnAlign(col),
                      position: isLeftFrozen ? "sticky" : undefined,
                      left: isLeftFrozen
                        ? leftStickyOffsets[col.field]
                        : undefined,
                      transform: isLeftFrozen
                        ? "translate3d(0,0,0)"
                        : undefined,
                      ...col.headerStyle,
                    }}
                    className={cn(
                      "font-semibold text-foreground select-none border-r border-border/60 last:border-r-0 relative group transition-colors duration-150",
                      col.sortable && "cursor-pointer hover:bg-muted/75",
                      isLeftFrozen &&
                        "z-20 bg-background/30 backdrop-blur-sm shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)]",
                      draggedField === col.field && "opacity-40 bg-muted/10",
                      densityCellPadding,
                    )}
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          getJustifyClass(getColumnAlign(col)),
                        )}
                      >
                        <Menu
                          size={10}
                          className="text-muted-foreground/30 opacity-0 group-hover:opacity-100 cursor-grab shrink-0 transition-opacity"
                        />
                        <span className="truncate">{col.header}</span>
                        {col.sortable && (
                          <span className="opacity-40 shrink-0">
                            {sortField === col.field && sortOrder === 1 ? (
                              <ArrowUp
                                size={10}
                                className="opacity-100 text-primary"
                              />
                            ) : sortField === col.field && sortOrder === -1 ? (
                              <ArrowDown
                                size={10}
                                className="opacity-100 text-primary"
                              />
                            ) : (
                              <ArrowUpDown size={10} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resize Handle */}
                    {col.resizable !== false && (
                      <div
                        onMouseDown={(e) =>
                          handleResizeStart(e, col.field, width)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/40 hover:w-1.5 active:bg-primary z-30 transition-all duration-150"
                      />
                    )}
                  </th>
                );
              })}

              {/* Actions Header */}
              {rowActions.length > 0 && (
                <th
                  style={{
                    width: rowActionsWidth,
                    position: rowActionsFrozen ? "sticky" : undefined,
                    right: rowActionsFrozen ? 0 : undefined,
                    transform: rowActionsFrozen
                      ? "translate3d(0,0,0)"
                      : undefined,
                  }}
                  className={cn(
                    "font-semibold text-muted-foreground text-center border-l border-border bg-muted/20 z-20",
                    rowActionsFrozen &&
                      "right-0 bg-background/30 backdrop-blur-sm shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                    densityCellPadding,
                  )}
                >
                  {"Hành động"}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    (enableSelection ? 1 : 0) +
                    (showIndexList ? 1 : 0) +
                    (rowActions.length > 0 ? 1 : 0)
                  }
                  className="p-12 text-center"
                >
                  <div className="flex justify-center items-center gap-3">
                    <Loader2 size={18} className="animate-spin text-primary" />
                    <span className="text-slate-400">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    (enableSelection ? 1 : 0) +
                    (showIndexList ? 1 : 0) +
                    (rowActions.length > 0 ? 1 : 0)
                  }
                  className="p-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox size={32} className="text-muted-foreground/60" />
                    <span className="text-slate-400 text-sm font-medium">
                      {emptyText || "Không có dữ liệu"}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              displayData.map((rowData, rowIndex) => (
                <tr
                  key={rowData[dataKey] || rowIndex}
                  onClick={() => onRowClick?.({ data: rowData })}
                  className={cn(
                    "border-b border-border/60 hover:bg-muted/30 transition-all duration-150 cursor-pointer",
                    stripedRows && rowIndex % 2 === 1 && "bg-muted/15",
                  )}
                >
                  {/* Checkbox Cell */}
                  {enableSelection && (
                    <td
                      className={cn(
                        "text-center border-r border-border/60 bg-background/30 z-10 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)]",
                        densityCellPadding,
                      )}
                      style={{
                        position: "sticky",
                        left: 0,
                        transform: "translate3d(0,0,0)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isRowSelected(rowData)}
                          onChange={(e) =>
                            handleSelectRow(rowData, e.target.checked)
                          }
                          className="rounded-sm border-border bg-transparent text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                      </div>
                    </td>
                  )}

                  {/* STT Cell */}
                  {showIndexList && (
                    <td
                      className={cn(
                        "text-center border-r border-border/60 bg-background/30 z-10 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)]",
                        densityCellPadding,
                      )}
                      style={{
                        position: "sticky",
                        left: enableSelection ? 48 : 0,
                        transform: "translate3d(0,0,0)",
                      }}
                    >
                      {pagination
                        ? (pagination.current - 1) * rows + rowIndex + 1
                        : rowIndex + 1}
                    </td>
                  )}

                  {/* Data Cells */}
                  {visibleColumns.map((col) => {
                    const isLeftFrozen =
                      col.frozen && col.alignFrozen !== "right";
                    return (
                      <td
                        key={col.field}
                        style={{
                          textAlign: getColumnAlign(col),
                          position: isLeftFrozen ? "sticky" : undefined,
                          left: isLeftFrozen
                            ? leftStickyOffsets[col.field]
                            : undefined,
                          transform: isLeftFrozen
                            ? "translate3d(0,0,0)"
                            : undefined,
                          ...col.bodyStyle,
                        }}
                        className={cn(
                          "border-r border-border/50 last:border-r-0 truncate transition-all duration-150",
                          isLeftFrozen &&
                            "z-10 bg-background/40 backdrop-blur-sm shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)]",
                          densityCellPadding,
                        )}
                      >
                        {renderColumnCell(col, rowData, rowIndex)}
                      </td>
                    );
                  })}

                  {/* Actions Cell */}
                  {rowActions.length > 0 && (
                    <td
                      style={{
                        position: rowActionsFrozen ? "sticky" : undefined,
                        right: rowActionsFrozen ? 0 : undefined,
                        transform: rowActionsFrozen
                          ? "translate3d(0,0,0)"
                          : undefined,
                        ...rowActionsStyle,
                      }}
                      className={cn(
                        "text-center border-l border-border bg-background/30 backdrop-blur-sm z-10",
                        rowActionsFrozen &&
                          "right-0 bg-background/30 backdrop-blur-sm shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                        densityCellPadding,
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {rowActions
                          .filter((action) => isActionVisible(action, rowData))
                          .map((action, actionIndex) => {
                            const disabled = isActionDisabled(action, rowData);
                            const loadingState = isActionLoading(
                              action,
                              rowData,
                            );

                            const colorClass = (() => {
                              switch (action.severity) {
                                case "success":
                                  return "text-emerald-500/70 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-500";
                                case "info":
                                  return "text-sky-500/70 border-sky-500/20 hover:bg-sky-500/10 hover:text-sky-500";
                                case "warning":
                                  return "text-amber-500/70 border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-550";
                                case "danger":
                                  return "text-red-500/70 border-red-500/20 hover:bg-red-500/10 hover:text-red-500";
                                case "secondary":
                                  return "text-muted-foreground/70 border-muted-foreground/20 hover:bg-muted-foreground/10 hover:text-muted-foreground";
                                default:
                                  return "text-indigo-500/70 border-indigo-500/20 hover:bg-indigo-500/10 hover:text-indigo-500";
                              }
                            })();

                            return (
                              <button
                                key={action.key || actionIndex}
                                disabled={disabled || loadingState}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick?.(rowData, rowIndex);
                                }}
                                title={action.tooltip || undefined}
                                className={cn(
                                  "w-6.5 h-6.5 flex items-center justify-center border rounded transition-colors",
                                  colorClass,
                                  (disabled || loadingState) &&
                                    "opacity-55 cursor-not-allowed",
                                )}
                              >
                                {loadingState ? (
                                  <Loader2 size={11} className="animate-spin" />
                                ) : typeof action.icon === "string" ? (
                                  <i className={cn("text-xs", action.icon)} />
                                ) : (
                                  action.icon
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination && !loading && data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-1">
          <div className="text-xs text-muted-foreground font-medium">
            Hiển thị {(pagination.current - 1) * rows + 1} -{" "}
            {Math.min(pagination.current * rows, pagination.total)} của{" "}
            {pagination.total} bản ghi
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Số dòng:</span>
              <Select
                value={String(rows)}
                onValueChange={(val) => handlePageSizeChange(Number(val))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" side="top">
                  {enumData.PAGE.LST_PAGESIZE.map((size: number) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
              >
                Trước
              </Button>
              <span className="text-xs font-semibold px-3">
                {pagination.current} / {Math.ceil(pagination.total / rows)}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={
                  pagination.current >= Math.ceil(pagination.total / rows)
                }
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableCustom;
