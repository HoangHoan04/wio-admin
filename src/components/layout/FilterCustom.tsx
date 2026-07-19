import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, Search, Undo2 } from "lucide-react";
import { useState } from "react";

export interface FilterOption {
  label?: string;
  name?: string;
  code?: string;
  value: any;
}

export interface FilterField {
  key: string;
  label: string;
  type:
    | "input"
    | "textarea"
    | "select"
    | "multiSelect"
    | "number"
    | "switch"
    | "date"
    | "dateRange"
    | "customButton"
    | "custom";
  placeholder?: string;
  options?: FilterOption[];
  onClick?: () => void;
  buttonText?: string;
  disabled?: boolean;
  col?: number;
  render?: (value: any, onChange: (next: any) => void) => React.ReactNode;
  colClassName?: string;
}

interface FilterCustomProps {
  title?: string;
  fields: FilterField[];
  filters: Record<string, any>;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  isOpen?: boolean;
  onFiltersChange?: (val: Record<string, any>) => void;
  onSearch?: () => void;
  onClear?: () => void;
}

const getColClass = (col?: number) => {
  switch (col) {
    case 3:
      return "lg:col-span-[3]";
    case 4:
      return "lg:col-span-[4]";
    case 6:
      return "lg:col-span-[6]";
    case 8:
      return "lg:col-span-[8]";
    case 12:
      return "lg:col-span-[12]";
    case 24:
      return "lg:col-span-[24]";
    default:
      return "lg:col-span-[6]";
  }
};

function getOptionLabel(opt: FilterOption): string {
  return opt.label || opt.name || opt.code || "";
}

const optionValueToString = (value: any): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const findOptionByStringValue = (
  options: FilterOption[],
  value: string,
): FilterOption | undefined => {
  return options.find((opt) => optionValueToString(opt.value) === value);
};

const getSelectedLabel = (
  field: FilterField,
  filters: Record<string, any>,
): string => {
  const value = filters[field.key];
  if (value === undefined || value === null || value === "") {
    return field.placeholder || "Chọn...";
  }
  const options = field.options || [];
  const selected = options.find(
    (opt) => optionValueToString(opt.value) === optionValueToString(value),
  );
  return selected ? getOptionLabel(selected) : String(value);
};

interface FilterSelectProps {
  field: FilterField;
  filters: Record<string, any>;
  onChange: (value: any) => void;
}

function FilterSelect({ field, filters, onChange }: FilterSelectProps) {
  const anchorRef = useComboboxAnchor();

  return (
    <Combobox
      value={optionValueToString(filters[field.key])}
      onValueChange={(val) => {
        const strValue = String(val || "");
        if (!strValue) {
          onChange(undefined);
          return;
        }
        const selected = findOptionByStringValue(field.options || [], strValue);
        onChange(selected ? selected.value : strValue);
      }}
      disabled={field.disabled}
    >
      <div ref={anchorRef} className="w-full">
        <ComboboxTrigger
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            !filters[field.key] && "text-muted-foreground",
          )}
        >
          <ComboboxValue>{getSelectedLabel(field, filters)}</ComboboxValue>
        </ComboboxTrigger>
      </div>
      <ComboboxContent anchor={anchorRef} className="min-w-0 w-[--anchor-width]">
        <ComboboxList>
          {(field.options || []).map((opt) => (
            <ComboboxItem
              key={String(opt.value)}
              value={optionValueToString(opt.value)}
            >
              {getOptionLabel(opt)}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default function FilterCustom({
  title = "Tìm kiếm",
  fields,
  filters,
  showSearchButton = true,
  showClearButton = true,
  isOpen = true,
  onFiltersChange,
  onSearch,
  onClear,
}: FilterCustomProps) {
  const [open, setOpen] = useState(isOpen);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange?.(newFilters);
  };

  const handleSearch = () => onSearch?.();
  const handleClear = () => {
    onFiltersChange?.({});
    onClear?.();
  };

  const renderMultiSelect = (field: FilterField) => {
    const selected = (filters[field.key] as any[]) || [];
    const options = field.options || [];

    const toggleOption = (value: any) => {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      handleFilterChange(field.key, next);
    };

    const selectAll = () => {
      handleFilterChange(
        field.key,
        selected.length === options.length ? [] : options.map((o) => o.value),
      );
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={field.disabled}
            className="w-full justify-between h-9 px-2.5 text-sm font-normal"
          >
            <span className="truncate text-muted-foreground">
              {selected.length > 0
                ? `${selected.length} đã chọn`
                : field.placeholder || "Chọn..."}
            </span>
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="start">
          <div className="space-y-1">
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                checked={
                  selected.length === options.length && options.length > 0
                }
                onChange={selectAll}
                className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>Tất cả</span>
            </label>
            <div className="h-px bg-border" />
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <label
                  key={String(opt.value)}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-xs font-medium"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOption(opt.value)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>{getOptionLabel(opt)}</span>
                </label>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderDatePicker = (field: FilterField) => {
    const value = filters[field.key];
    const date = value ? new Date(value) : undefined;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={field.disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-9 px-2.5",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date
              ? format(date, "yyyy-MM-dd")
              : field.placeholder || "Chọn ngày"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) =>
              handleFilterChange(field.key, d ? format(d, "yyyy-MM-dd") : null)
            }
          />
        </PopoverContent>
      </Popover>
    );
  };

  const renderDateRangePicker = (field: FilterField) => {
    const value = filters[field.key] as [string, string] | undefined;
    const from = value?.[0] ? new Date(value[0]) : undefined;
    const to = value?.[1] ? new Date(value[1]) : undefined;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={field.disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-9 px-2.5",
              !from && !to && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {from && to
              ? `${format(from, "dd/MM")} - ${format(to, "dd/MM")}`
              : field.placeholder || "Chọn khoảng ngày"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from, to }}
            onSelect={(range) =>
              handleFilterChange(
                field.key,
                range?.from && range?.to
                  ? [
                      format(range.from, "yyyy-MM-dd"),
                      format(range.to, "yyyy-MM-dd"),
                    ]
                  : null,
              )
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm mb-3">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none border-b border-border bg-muted/30"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <ChevronDownIcon
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </div>

      {open && (
        <div className="p-4">
          <div className="grid grid-cols-[repeat(24,1fr)] gap-4">
            {fields.map((field) => (
              <div
                key={field.key}
                className={cn(
                  "col-span-24 flex flex-col gap-1.5",
                  getColClass(field.col),
                  field.colClassName,
                )}
              >
                <Label className="text-xs font-medium text-foreground">
                  {field.label}
                </Label>

                {field.type === "input" && (
                  <Input
                    value={filters[field.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
                    disabled={field.disabled}
                    placeholder={field.placeholder}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    value={filters[field.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
                    disabled={field.disabled}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                )}

                {field.type === "number" && (
                  <Input
                    type="number"
                    value={filters[field.key] ?? ""}
                    onChange={(e) =>
                      handleFilterChange(
                        field.key,
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    disabled={field.disabled}
                    placeholder={field.placeholder}
                  />
                )}

                {field.type === "select" && (
                  <FilterSelect
                    field={field}
                    filters={filters}
                    onChange={(value) => handleFilterChange(field.key, value)}
                  />
                )}

                {field.type === "multiSelect" && renderMultiSelect(field)}

                {field.type === "switch" && (
                  <div className="flex items-center h-9">
                    <Switch
                      checked={!!filters[field.key]}
                      onCheckedChange={(checked) =>
                        handleFilterChange(field.key, checked)
                      }
                      disabled={field.disabled}
                    />
                  </div>
                )}

                {field.type === "date" && renderDatePicker(field)}

                {field.type === "dateRange" && renderDateRangePicker(field)}

                {field.type === "customButton" && (
                  <Button
                    variant="outline"
                    onClick={field.onClick}
                    disabled={field.disabled}
                    className="w-full h-9"
                  >
                    {field.buttonText || field.label}
                  </Button>
                )}

                {field.type === "custom" && field.render && (
                  <div className="flex-1">
                    {field.render(filters[field.key], (v: any) =>
                      handleFilterChange(field.key, v),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {(showSearchButton || showClearButton) && (
            <div className="mt-4 flex justify-center gap-2">
              {showSearchButton && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSearch}
                  className="h-8 text-xs gap-1.5"
                >
                  <Search className="size-3.5" />
                  Tìm kiếm
                </Button>
              )}
              {showClearButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 text-xs gap-1.5"
                >
                  <Undo2 className="size-3.5" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
