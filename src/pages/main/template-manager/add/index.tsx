import { enumData } from "@/common/enums";
import BaseView from "@/components/layout/BaseView";
import {
  type FormField,
  type FormRef,
  FormCustom,
} from "@/components/layout/FormCustom";
import type { CreateTemplateDto, TemplateDto } from "@/dto";
import { useSelectBoxServicePlan } from "@/hooks/service-plan";
import { useCreateTemplate } from "@/hooks/template";
import { useRouter } from "@/routes/hooks";
import { useMemo, useRef, useState } from "react";
import TemplateCanvasPresetEditor from "../components/TemplateCanvasPresetEditor";
import TemplateLayoutEditor from "../components/TemplateLayoutEditor";
import TemplateTokensEditor from "../components/TemplateTokensEditor";
import {
  getDefaultCanvasPreset,
  getDefaultLayout,
  getDefaultTokens,
  isEmptyLayout,
  isEmptyTokens,
  normalizeCanvasPreset,
  normalizeLayout,
  normalizeTokens,
} from "../template-form.utils";

function toEnumOptions(source: Record<string, { code: string; name: string }>) {
  return Object.values(source).map((item) => ({
    id: item.code,
    name: item.name,
    value: item.code,
  }));
}

function normalizeFeaturesForForm(features: unknown): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features.map(String).filter(Boolean);
  if (typeof features === "object") {
    const record = features as Record<string, any>;
    if (Array.isArray(record.list)) {
      return record.list.map(String).filter(Boolean);
    }
    return Object.entries(record)
      .filter(([, value]) => value === true)
      .map(([key]) => key);
  }
  return [];
}

function buildInitialValues(initData?: TemplateDto) {
  if (!initData) {
    return {
      isShow: true,
      isPremium: false,
      trialDays: 3,
      version: 1,
      sortOrder: 0,
      kind: enumData.TEMPLATE_KIND.CODE_THEME.code,
      weddingTheme: enumData.WEDDING_THEME.CLASSIC.code,
      themeLayout: getDefaultLayout(),
      presetTokens: getDefaultTokens(),
      canvasPreset: getDefaultCanvasPreset(),
    };
  }

  return {
    ...initData,
    minPlanId: initData.minPlanId || undefined,
    categories: (initData.categories || []).map((item) =>
      typeof item === "string" ? item : item.category,
    ),
    features: normalizeFeaturesForForm(initData.features),
    themeLayout: normalizeLayout(initData.themeLayout, initData.themeCode),
    presetTokens: normalizeTokens(initData.presetTokens, initData.themeCode),
    canvasPreset: normalizeCanvasPreset(initData.canvasPreset),
  };
}

function toTemplatePayload(values: Record<string, any>): CreateTemplateDto {
  const kind = values.kind || enumData.TEMPLATE_KIND.CODE_THEME.code;
  return {
    name: values.name,
    slug: values.slug || undefined,
    description: values.description || undefined,
    weddingTheme: values.weddingTheme,
    themeCode: values.themeCode,
    kind,
    version: values.version ?? 1,
    colorMood: values.colorMood || undefined,
    tags: Array.isArray(values.tags) ? values.tags : [],
    thumbnailUrl: values.thumbnailUrl || undefined,
    previewUrl: values.previewUrl || undefined,
    isShow: values.isShow !== false,
    isPremium: values.isPremium === true,
    minPlanId: values.minPlanId || undefined,
    trialDays: values.trialDays ?? 3,
    sortOrder: values.sortOrder ?? 0,
    categories: Array.isArray(values.categories) ? values.categories : [],
    features: Array.isArray(values.features)
      ? { list: values.features }
      : values.features || undefined,
    themeLayout: normalizeLayout(values.themeLayout, values.themeCode) as any,
    presetTokens: normalizeTokens(values.presetTokens, values.themeCode) as any,
    canvasPreset:
      kind === enumData.TEMPLATE_KIND.CANVAS_PRESET.code
        ? (normalizeCanvasPreset(values.canvasPreset) as any)
        : undefined,
  };
}

function AddTemplatePage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới mẫu thiệp",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: TemplateDto;
  isEdit?: boolean;
  handleUpdate?: (data: CreateTemplateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTemplate } = useCreateTemplate();
  const router = useRouter();
  const { data: plans } = useSelectBoxServicePlan();
  const formRef = useRef<FormRef>(null);
  const lastThemeCode = useRef(initData?.themeCode);
  const initialValues = useMemo(() => buildInitialValues(initData), [initData]);
  const [kind, setKind] = useState(
    () => initialValues.kind || enumData.TEMPLATE_KIND.CODE_THEME.code,
  );
  const [themeCode, setThemeCode] = useState(initData?.themeCode);

  const handleChangeValue = (allValues: Record<string, any>) => {
    setKind(allValues.kind || enumData.TEMPLATE_KIND.CODE_THEME.code);
    setThemeCode(allValues.themeCode);
    if (allValues.themeCode && allValues.themeCode !== lastThemeCode.current) {
      lastThemeCode.current = allValues.themeCode;
      const next: Record<string, any> = {};
      if (isEmptyLayout(allValues.themeLayout)) {
        next.themeLayout = getDefaultLayout(allValues.themeCode);
      }
      if (isEmptyTokens(allValues.presetTokens)) {
        next.presetTokens = getDefaultTokens(allValues.themeCode);
      }
      if (Object.keys(next).length) {
        formRef.current?.setFieldsValue(next);
      }
    }
  };

  const formFields = useMemo((): FormField[] => {
    const fields: FormField[] = [
      {
        name: "name",
        label: "Tên mẫu thiệp",
        type: "input",
        required: true,
        placeholder: "Nhập tên mẫu thiệp",
        maxLength: 100,
      },
      {
        name: "slug",
        label: "Slug",
        type: "input",
        placeholder: "Để trống sẽ tạo tự động từ tên",
        maxLength: 100,
      },
      {
        name: "weddingTheme",
        label: "Phong cách cưới",
        type: "select",
        required: true,
        options: toEnumOptions(enumData.WEDDING_THEME),
        placeholder: "Chọn phong cách cưới",
      },
      {
        name: "themeCode",
        label: "Mã theme",
        type: "select",
        required: true,
        options: toEnumOptions(enumData.THEME_CODE),
        placeholder: "Chọn mã theme React/Canva",
      },
      {
        name: "kind",
        label: "Loại mẫu",
        type: "select",
        required: true,
        options: toEnumOptions(enumData.TEMPLATE_KIND),
        placeholder: "Chọn loại mẫu",
      },
      {
        name: "version",
        label: "Version",
        type: "number",
        min: 1,
        placeholder: "1",
      },
      {
        name: "colorMood",
        label: "Tông màu",
        type: "input",
        placeholder: "vd: ấm, hồng pastel, vàng gold",
        maxLength: 50,
      },
      {
        name: "minPlanId",
        label: "Gói tối thiểu",
        type: "select",
        required: false,
        options: (plans || []).map((item) => ({
          id: item.id,
          name: item.name,
          value: item.id,
        })),
        placeholder: "Chọn gói tối thiểu",
      },
      {
        name: "trialDays",
        label: "Số ngày dùng thử",
        type: "number",
        required: true,
        placeholder: "Nhập số ngày dùng thử",
        min: 0,
        max: 30,
      },
      {
        name: "sortOrder",
        label: "Thứ tự hiển thị",
        type: "number",
        min: 0,
        placeholder: "0",
      },
      {
        name: "isShow",
        label: "Hiển thị cho khách",
        type: "checkbox",
      },
      {
        name: "isPremium",
        label: "Premium",
        type: "checkbox",
      },
      {
        name: "tags",
        label: "Tags tìm kiếm",
        type: "tags",
        placeholder: "Nhập tags, phân cách bằng dấu phẩy",
        gridColumn: "span 3",
      },
      {
        name: "categories",
        label: "Danh mục phong cách",
        type: "multiselect",
        options: toEnumOptions(enumData.WEDDING_THEME),
        placeholder: "Chọn một hoặc nhiều phong cách",
        gridColumn: "span 3",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả ngắn",
        maxLength: 255,
        gridColumn: "span 3",
      },
      {
        name: "features",
        label: "Tính năng nổi bật",
        type: "features",
        placeholder: "Mỗi dòng một tính năng, ví dụ:\nRSVP\nAlbum ảnh\nBản đồ",
        gridColumn: "span 3",
      },
      {
        name: "thumbnailUrl",
        label: "Ảnh thumbnail",
        type: "image",
        isSingle: true,
      },
      {
        name: "previewUrl",
        label: "Ảnh / URL xem trước",
        type: "image",
        isSingle: true,
      },
      {
        name: "themeLayout",
        label: "",
        type: "custom",
        gridColumn: "span 3",
        render: ({ value, onChange }) => (
          <TemplateLayoutEditor
            value={value}
            themeCode={themeCode}
            onChange={onChange}
          />
        ),
      },
      {
        name: "presetTokens",
        label: "",
        type: "custom",
        gridColumn: "span 3",
        render: ({ value, onChange }) => (
          <TemplateTokensEditor
            value={value}
            themeCode={themeCode}
            onChange={onChange}
          />
        ),
      },
    ];

    if (kind === enumData.TEMPLATE_KIND.CANVAS_PRESET.code) {
      fields.push({
        name: "canvasPreset",
        label: "",
        type: "custom",
        gridColumn: "span 3",
        render: ({ value, onChange }) => (
          <TemplateCanvasPresetEditor value={value} onChange={onChange} />
        ),
      });
    }

    return fields;
  }, [plans, kind, themeCode]);

  const handleSubmit = (values: Record<string, any>) => {
    const payload = toTemplatePayload(values);
    if (isEdit && handleUpdate) {
      handleUpdate(payload);
    } else {
      onCreateTemplate(payload);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        ref={formRef}
        title={title}
        showDivider={true}
        fields={formFields}
        initialValues={initialValues}
        loading={isLoading || isLoadingUpdate}
        onChangeValue={handleChangeValue}
        onSubmit={handleSubmit}
        onCancel={onCancel || goBack}
        submitText="Lưu"
        cancelText="Hủy"
        gap="20px"
        gridColumns={3}
      />
    </BaseView>
  );
}

export default AddTemplatePage;
