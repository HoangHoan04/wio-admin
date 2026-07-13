import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/store/toastStore";
import dayjs from "dayjs";
import { CalendarIcon, Check, ChevronDownIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import FileUploadCustom from "./FileUpload";
import type { FormField } from "./FormCustom";

const isDeepEqual = (a: any, b: any) => {
  if (a === b) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return false;
  }
};

const RequiredLabel = memo(
  ({ label, required }: { label: string; required?: boolean }) => (
    <label className="mb-2 block text-sm font-medium">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  ),
);

const CustomCalendar = memo(({ field, value, onChange, commonProps }: any) => {
  const { showToast } = useToast();
  const lastToastRef = useRef<string>("");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    value ? dayjs(value).format("DD/MM/YYYY") : "",
  );

  const handleRealtimeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const inputType = (e as any).nativeEvent?.inputType;
    if (inputType?.includes("delete") || inputType?.includes("remove")) {
      return;
    }

    const val = target.value;
    const digits = val.replace(/\D/g, "");

    let formatted = "";

    if (digits.length >= 2) {
      const dayStr = digits.substring(0, 2);
      const dayNum = parseInt(dayStr, 10);

      if (dayNum > 31 || dayNum === 0) {
        if (lastToastRef.current !== "day") {
          showToast({
            type: "error",
            title: "Ngày không hợp lệ",
            message: "Ngày phải nằm trong khoảng từ 01 đến 31",
          });
          lastToastRef.current = "day";
          setTimeout(() => (lastToastRef.current = ""), 2000);
        }
        formatted = digits.substring(0, 1);
        target.value = formatted;
        return;
      }

      formatted += dayStr;
      if (digits.length > 2) {
        formatted += "/";
      }
    } else {
      formatted = digits;
    }

    if (digits.length >= 4) {
      const monthStr = digits.substring(2, 4);
      const monthNum = parseInt(monthStr, 10);

      if (monthNum > 12 || monthNum === 0) {
        if (lastToastRef.current !== "month") {
          showToast({
            type: "error",
            title: "Tháng không hợp lệ",
            message: "Tháng phải nằm trong khoảng từ 01 đến 12",
          });
          lastToastRef.current = "month";
          setTimeout(() => (lastToastRef.current = ""), 2000);
        }
        formatted = formatted.substring(0, 3) + digits.substring(2, 3);
        target.value = formatted;
        return;
      }

      formatted += monthStr;
      if (digits.length > 4) {
        formatted += "/";
      }
    } else if (digits.length > 2) {
      formatted += digits.substring(2);
    }

    if (digits.length >= 5) {
      const yearStr = digits.substring(4, 8);
      formatted += yearStr;

      if (yearStr.length === 4) {
        const yearNum = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear();

        if (yearNum > currentYear || yearNum < 1900) {
          if (lastToastRef.current !== "year") {
            showToast({
              type: "error",
              title: "Năm không hợp lệ",
              message: `Năm không được lớn hơn năm hiện tại (${currentYear})`,
            });
            lastToastRef.current = "year";
            setTimeout(() => (lastToastRef.current = ""), 2000);
          }
          formatted = formatted.substring(0, 6) + yearStr.substring(0, 3);
          target.value = formatted;
          return;
        }

        const dayStr = digits.substring(0, 2);
        const monthStr = digits.substring(2, 4);
        const parsedObj = dayjs(`${yearStr}-${monthStr}-${dayStr}`);
        if (parsedObj.isValid()) {
          onChange(field.name, parsedObj.toDate());
          setInputValue(`${dayStr}/${monthStr}/${yearStr}`);
        }
      }
    }

    target.value = formatted;
  };

  const handleInputBlur = (e: any) => {
    const rawValue = e.target?.value;
    if (!rawValue) return;

    const digits = rawValue.replace(/\D/g, "");

    if (digits.length === 8) {
      const d = digits.substring(0, 2);
      const m = digits.substring(2, 4);
      const y = digits.substring(4, 8);

      const parsed = dayjs(`${y}-${m}-${d}`);
      if (parsed.isValid()) {
        onChange(field.name, parsed.toDate());
        setInputValue(`${d}/${m}/${y}`);
      }
    }
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(field.name, date);
      setInputValue(dayjs(date).format("DD/MM/YYYY"));
      setOpen(false);
    }
  };

  const date = value ? dayjs(value).toDate() : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={commonProps.disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-9 px-2.5",
            !inputValue && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {inputValue || field.placeholder || "DD/MM/YYYY"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2 border-b border-border">
          <Input
            value={inputValue}
            onChange={handleRealtimeInput}
            onBlur={handleInputBlur}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                handleInputBlur(e);
              }
            }}
            placeholder="DD/MM/YYYY"
            className="h-8 text-sm"
          />
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={field.disabledDate}
        />
      </PopoverContent>
    </Popover>
  );
});

const Editor = ({ value, onTextChange, style, placeholder }: any) => {
  return (
    <Textarea
      value={value || ""}
      onChange={(e) => onTextChange?.({ htmlValue: e.target.value })}
      style={style}
      placeholder={placeholder}
    />
  );
};

interface FieldItemProps {
  field: FormField;
  value: any;
  onChange: (key: string, value: any) => void;
  setRef: (name: string, el: any) => void;
  getValues: () => any;
  allValues?: Record<string, any>;
}

const FieldItem = memo(
  ({
    field,
    value,
    onChange,
    setRef,
    getValues,
    allValues,
  }: FieldItemProps) => {
    const { theme } = useTheme();

    const commonProps = {
      style: { width: "100%", ...(field.inputStyle || {}) },
      disabled: field.disabled,
    };

    const handleSetRef = (el: any) => setRef(field.name, el);

    switch (field.type) {
      case "input":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Input
              value={value || ""}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.name, e.target.value)}
              {...commonProps}
            />
          </div>
        );
      case "email":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Input
              type="email"
              value={value || ""}
              placeholder={field.placeholder || "example@email.com"}
              onChange={(e) => onChange(field.name, e.target.value)}
              {...commonProps}
            />
          </div>
        );

      case "phoneNumber":
        return (
          <div ref={handleSetRef} className="phone-input-container">
            <RequiredLabel label={field.label} required={field.required} />
            <PhoneInput
              country={"vn"}
              value={value}
              onChange={(phone) => onChange(field.name, phone)}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "6px",
                borderColor: theme === "dark" ? "#424b57" : "#ced4da",
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              buttonStyle={{
                borderColor: theme === "dark" ? "#424b57" : "#ced4da",
                backgroundColor: theme === "dark" ? "#262626" : "#f8f9fa",
              }}
              dropdownStyle={{
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              searchStyle={{
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholder={field.placeholder || "Số điện thoại"}
              disabled={field.disabled}
              enableSearch={true}
            />
          </div>
        );
      case "textarea":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Textarea
              value={value || ""}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.name, e.target.value)}
              rows={4}
              {...commonProps}
            />
          </div>
        );
      case "richtext":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Editor
              value={value || ""}
              onTextChange={(e: any) => onChange(field.name, e.htmlValue || "")}
              style={{ height: "350px" }}
              placeholder={field.placeholder}
            />
          </div>
        );
      case "number":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Input
              type="number"
              value={value ?? ""}
              onChange={(e) =>
                onChange(
                  field.name,
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              {...commonProps}
            />
          </div>
        );
      case "select": {
        const selectOptions = useMemo(
          () =>
            field.options && field.options.length > 0
              ? field.options.map((o) => ({
                  label: o.name,
                  value: o.value,
                }))
              : [{ label: "Không có lựa chọn", value: "" }],
          [field.options],
        );
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Select
              value={value ?? ""}
              onValueChange={(val) => onChange(field.name, val || undefined)}
              disabled={field.disabled}
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue
                  placeholder={field.placeholder ?? "Không có lựa chọn"}
                />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((opt) => (
                  <SelectItem key={String(opt.value)} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }
      case "multiselect": {
        const multiselectOptions = useMemo(
          () =>
            field.options?.map((o) => ({
              label: o.name,
              value: o.value,
            })) || [],
          [field.options],
        );
        const selected = value || [];

        const toggleOption = (optValue: string) => {
          const next = selected.includes(optValue)
            ? selected.filter((v: string) => v !== optValue)
            : [...selected, optValue];
          onChange(field.name, next);
        };

        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
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
                  {multiselectOptions.map((opt) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                      <label
                        key={String(opt.value)}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-xs font-medium"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleOption(opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      }
      case "datepicker":
      case "datetimepicker":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <CustomCalendar
              field={field}
              value={value}
              onChange={onChange}
              commonProps={commonProps}
            />
          </div>
        );
      case "switch":
        return (
          <div className="flex items-center gap-2" ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Switch
              checked={!!value}
              onCheckedChange={(checked) => onChange(field.name, checked)}
              disabled={field.disabled}
            />
          </div>
        );
      case "checkbox":
        return (
          <div
            className="flex h-full items-center pt-8 gap-2"
            ref={handleSetRef}
          >
            <Checkbox
              id={field.name}
              checked={value || false}
              onCheckedChange={(checked) => onChange(field.name, checked)}
            />
            <label htmlFor={field.name} className="cursor-pointer select-none">
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
          </div>
        );
      case "radioGroup":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <RadioGroup
              value={value}
              onValueChange={(val) => onChange(field.name, val)}
            >
              <div className="flex flex-wrap gap-3">
                {field.options?.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={opt.value}
                      id={`${field.name}_${opt.value}`}
                    />
                    <label
                      htmlFor={`${field.name}_${opt.value}`}
                      className="cursor-pointer"
                    >
                      {opt.name}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );
      case "file":
      case "image":
        return (
          <div ref={handleSetRef} className="w-full">
            <FileUploadCustom
              label={field.label}
              required={field.required}
              initValue={value}
              onFileUploaded={(uploadedData) =>
                onChange(field.name, uploadedData)
              }
              type={field.type === "image" ? "image" : field.fileType || "all"}
              mode={field.isSingle ? "single" : "multi"}
              maxSize={field.maxSize || 10}
              disabled={field.disabled}
              className="w-full"
            />
          </div>
        );
      case "action":
        return (
          <div ref={handleSetRef}>
            <Button onClick={() => field.onAction?.(getValues())}>
              <Check className="size-4" />
              {field.buttonText || field.label || "Thực hiện"}
            </Button>
          </div>
        );
      case "tab":
        return (
          <div ref={handleSetRef} style={{ gridColumn: "span 24" }}>
            <Tabs defaultValue="0">
              <TabsList>
                {field.tabFields?.map((_, index) => (
                  <TabsTrigger key={index} value={String(index)}>
                    {index === 0 ? "Tiếng Việt" : "Tiếng Anh"}
                  </TabsTrigger>
                ))}
              </TabsList>
              {field.tabFields?.map((tabFields, index) => (
                <TabsContent key={index} value={String(index)}>
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
                    }}
                  >
                    {tabFields.map((subField) => (
                      <div
                        key={subField.name}
                        style={{
                          gridColumn:
                            subField.gridColumn || `span ${subField.col || 24}`,
                        }}
                      >
                        <FieldItem
                          field={subField}
                          value={allValues?.[subField.name]}
                          onChange={onChange}
                          setRef={setRef}
                          getValues={getValues}
                          allValues={allValues}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        );
      case "custom":
        return field.render ? (
          <div>
            <RequiredLabel label={field.label} required={field.required} />
            {field.render({
              value,
              onChange: (val: any) => onChange(field.name, val),
            })}
          </div>
        ) : null;
      default:
        return null;
    }
  },
  (prev, next) => {
    const valueChanged = prev.value !== next.value;
    const disabledChanged = prev.field.disabled !== next.field.disabled;
    const allValuesChanged = !isDeepEqual(prev.allValues, next.allValues);
    const optionsChanged = !isDeepEqual(prev.field.options, next.field.options);
    const renderChanged = prev.field.render !== next.field.render;
    return (
      !valueChanged &&
      !disabledChanged &&
      !allValuesChanged &&
      !optionsChanged &&
      !renderChanged
    );
  },
);

function flattenFields(fields: FormField[]): FormField[] {
  const result: FormField[] = [];
  for (const field of fields) {
    if (field.type === "tab" && field.tabFields) {
      field.tabFields.forEach((tabFieldArray) => {
        result.push(...tabFieldArray);
      });
    } else {
      result.push(field);
    }
  }
  return result;
}

function normalizeValues(
  values: Record<string, any>,
  fields: FormField[],
): Record<string, any> {
  const flatFields = flattenFields(fields);
  const result = { ...values };

  for (const field of flatFields) {
    if (field.type === "datepicker" || field.type === "datetimepicker") {
      const val = result[field.name];
      if (val instanceof Date) {
        result[field.name] = dayjs(val).toISOString();
      } else if (val && typeof val === "string") {
        continue;
      } else if (val == null) {
        result[field.name] = undefined;
      }
    }
  }

  return result;
}

function useRenderFormCustom(
  fields: FormField[],
  initialValues: Record<string, any> = {},
  onChangeValue?: (allValues: any) => void,
) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errorField, setErrorField] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, any>>({});
  const { showToast } = useToast();

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setValues(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    if (errorField && fieldRefs.current[errorField]) {
      const element = fieldRefs.current[errorField];
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        if (element.focus) {
          element.focus();
        } else if (element.querySelector) {
          const input = element.querySelector("input, textarea, select");
          input?.focus();
        }
      }, 300);
      setErrorField(null);
    }
  }, [errorField]);

  const handleChange = useCallback(
    (key: string, value: any) => {
      setValues((prev) => {
        const newValues = { ...prev, [key]: value };
        if (onChangeValue) {
          onChangeValue(newValues);
        }
        return newValues;
      });
    },
    [onChangeValue],
  );

  const handleSetRef = useCallback((name: string, el: any) => {
    fieldRefs.current[name] = el;
  }, []);

  const getValues = useCallback(
    () => normalizeValues({ ...values }, fields),
    [values, fields],
  );

  const setValuesExternal = useCallback(
    (newValues: any) => setValues((prev) => ({ ...prev, ...newValues })),
    [],
  );

  const resetFields = useCallback(
    () => setValues(initialValues),
    [initialValues],
  );

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const validateFields = useCallback(async () => {
    const allFields = flattenFields(fields);

    for (const field of allFields) {
      const val = values[field.name];

      if (
        field.required &&
        (val === undefined ||
          val === "" ||
          val === null ||
          (Array.isArray(val) && val.length === 0))
      ) {
        showToast({
          type: "error",
          title: "Lỗi",
          message: "Trường này là bắt buộc",
        });
        setErrorField(field.name);
        return false;
      }

      if (field.type === "email" && val) {
        if (!validateEmail(val)) {
          showToast({
            type: "error",
            title: "Lỗi",
            message: "Email không hợp lệ",
          });
          setErrorField(field.name);
          return false;
        }
      }

      if (field.type === "phoneNumber" && val) {
        if (val.length < 8) {
          showToast({
            type: "error",
            title: "Lỗi",
            message: "Số điện thoại không hợp lệ",
          });
          setErrorField(field.name);
          return false;
        }
      }
    }
    return true;
  }, [fields, values, showToast]);

  const renderField = useCallback(
    (field: FormField) => {
      return (
        <FieldItem
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={handleChange}
          setRef={handleSetRef}
          getValues={getValues}
          allValues={values}
        />
      );
    },
    [values, handleChange, handleSetRef, getValues],
  );

  return {
    renderField,
    getValues,
    setValues: setValuesExternal,
    resetFields,
    validateFields,
  };
}

export { useRenderFormCustom };
