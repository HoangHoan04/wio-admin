import type { Dayjs } from "dayjs";
import type { ReactNode } from "react";
import { forwardRef, useImperativeHandle } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Save, XCircle } from "lucide-react";

import { useRenderFormCustom } from "./RenderField";

export interface FormRef {
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
  resetFields: () => void;
  validateFields: () => Promise<boolean>;
}

export interface FormField {
  name: string;
  label: string;
  isSingle?: boolean;
  type:
    | "input"
    | "select"
    | "multiselect"
    | "textarea"
    | "richtext"
    | "tab"
    | "file"
    | "switch"
    | "datepicker"
    | "datetimepicker"
    | "daterangepicker"
    | "timePicker"
    | "number"
    | "image"
    | "checkbox"
    | "action"
    | "radioGroup"
    | "timeRangePicker"
    | "email"
    | "phoneNumber"
    | "tags"
    | "json"
    | "features"
    | "custom";
  formatString?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: { id: string; name: string; value?: string; node?: ReactNode }[];
  col?: 4 | 6 | 8 | 12 | 24;
  gridColumn?: string;
  tabFields?: FormField[][];
  fileType?: "image" | "document";
  optionLabel?: string;
  optionValue?: string;
  toggleFields?: FormField[];
  dateFormat?: string;
  rangePlaceholder?: [string, string];
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  render?: (fieldProps: {
    value: any;
    onChange: (val: any) => void;
  }) => React.ReactNode;
  onChange?: (value: any, form?: any) => void;
  onClear?: () => void;
  disabledDate?: (current: Dayjs) => boolean;
  disabledTime?: (current: Dayjs) => any;
  disabled?: boolean;
  defaultValue?: Dayjs;
  step?: number;
  min?: number;
  max?: number;
  addonAfter?: string;
  customComponent?: ReactNode;
  multiple?: boolean;
  maxCount?: number;
  rules?: any[];
  accept?: string;
  maxSize?: number;
  showSearch?: boolean;
  onSearch?: (value: any) => void;
  loading?: boolean;
  onAction?: (value: any, form?: any) => void;
  buttonLoading?: boolean;
  buttonText?: string;
  showUploadList?: boolean;
  listType?: "text" | "picture" | "picture-card" | "picture-circle";
  allowClear?: boolean;
  showTime?: boolean;
  optionFilterProp?: string;
  filterOption?: (input: string, option: any) => boolean;
}

export interface FormCustomProps {
  title?: string;
  fields: FormField[];
  loading?: boolean;
  initialValues?: Record<string, any>;
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  showDivider?: boolean;
  formStyle?: React.CSSProperties;
  gridColumns?: number;
  gap?: string;
  onChangeValue?: (allValues: any) => void;
  form?: FormRef;
}

const FormCustom = forwardRef<FormRef, FormCustomProps>(function FormCustom(
  {
    title,
    fields,
    loading = false,
    initialValues,
    onSubmit,
    onCancel,
    onChangeValue,
    submitText,
    cancelText,
    showDivider = true,
    formStyle,
    gridColumns = 24,
    gap = "16px",
  },
  ref,
) {
  const { renderField, getValues, setValues, resetFields, validateFields } =
    useRenderFormCustom(fields, initialValues, onChangeValue);

  useImperativeHandle(ref, () => ({
    getFieldsValue: getValues,
    setFieldsValue: setValues,
    resetFields,
    validateFields,
  }));

  const handleSubmit = async () => {
    const isValid = await validateFields();
    if (!isValid) return;
    const values = getValues();
    onSubmit?.(values);
  };

  const getGridColumnSpan = (col?: 4 | 6 | 8 | 12 | 24) => {
    if (!col) return "span 1";
    return `span ${col}`;
  };

  return (
    <>
      {title && (
        <>
          <div className="flex items-center justify-center">
            <span className="text-xl font-semibold">{title}</span>
          </div>
          {showDivider && <Separator className="my-4" />}
        </>
      )}

      <div
        className="relative grid rounded-md p-6"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          gap,
          ...formStyle,
        }}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            style={{
              gridColumn: field.gridColumn || getGridColumnSpan(field.col),
            }}
          >
            {renderField(field)}
          </div>
        ))}

        {(onCancel || onSubmit) && (
          <div
            className="mt-4 text-center"
            style={{ gridColumn: `span ${gridColumns}` }}
          >
            <div className="flex justify-center gap-3">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                >
                  <XCircle className="size-4" />
                  {cancelText || "Hủy"}
                </Button>
              )}
              {onSubmit && (
                <Button
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <Save className="size-4" />
                  {submitText || "Lưu"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 flex h-[calc(100vh-200px)] w-full items-center justify-center overflow-y-auto">
          <Spinner className="size-8" />
        </div>
      )}
    </>
  );
});

export { FormCustom };
