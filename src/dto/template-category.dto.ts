import type { BaseDto } from "./common";

export interface TemplateCategoryDto extends BaseDto {
  templateId?: string;
  category: string; // Theme code e.g. CLASSIC, MODERN...
  sortOrder?: number;
  nameVi?: string;
  name?: string;
  slug?: string;
  code?: string;
  isActive?: boolean;
}

export interface FilterTemplateCategoryDto {
  category?: string;
  templateId?: string;
}
