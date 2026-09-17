import type { BaseDto } from "./common";
import type { ServicePlanDto } from "./service-plan.dto";

/* ============================================================
 * TEMPLATE
 * ============================================================ */
export interface TemplateDto extends BaseDto {
  name: string;
  slug: string;
  description?: string | null;
  weddingTheme: string; // enumData.WEDDING_THEME
  tags?: string[];
  colorMood?: string | null;
  features?: Record<string, boolean> | null;
  themeLayout?: Record<string, unknown> | null;
  presetTokens?: Record<string, unknown> | null;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  themeCode: string;
  isShow: boolean;
  isPremium: boolean;
  minPlanId?: string | null;
  minPlan?: ServicePlanDto;
  trialDays: number;
  viewCount: number;
  usedCount: number;
  sortOrder: number;
  categories?: TemplateCategoryDto[];
}

export interface CreateTemplateDto {
  name: string;
  slug?: string;
  description?: string | null;
  weddingTheme: string;
  tags?: string[];
  colorMood?: string | null;
  features?: Record<string, boolean> | null;
  themeLayout?: Record<string, unknown> | null;
  presetTokens?: Record<string, unknown> | null;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  themeCode: string;
  isShow?: boolean;
  isPremium?: boolean;
  minPlanId?: string | null;
  trialDays?: number;
  sortOrder?: number;
  categories?: string[];
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {
  id: string;
}

export interface SetPremiumTemplateDto {
  id: string;
  isPremium: boolean;
}

export interface SetIsShowTemplateDto {
  id: string;
  isShow: boolean;
}

export interface SetIsDeletedTemplateDto {
  id: string;
  isDeleted: boolean;
}

export interface FilterTemplateDto {
  name?: string;
  themeCode?: string;
  weddingTheme?: string;
  isShow?: boolean;
  isPremium?: boolean;
  isDeleted?: boolean;
  minPlanId?: string;
}

import type {
  FilterTemplateCategoryDto,
  TemplateCategoryDto,
} from "./template-category.dto";

export type { TemplateCategoryDto, FilterTemplateCategoryDto };

export interface SyncTemplateCategoryForTemplateDto {
  templateId: string;
  categories: string[];
}
