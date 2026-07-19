import type { BaseDto } from "./common";

export interface TemplateDto extends BaseDto {
  name: string;
  description: string;
  tags?: string[];
  features?: any;
  thumbnailUrl?: string;
  slug: string;
  themeCode: string;
  isShow: boolean;
  isPremium: boolean;
  minPlan: string;
  trialDays: number;
}

export interface CreateTemplateDto {
  name: string;
  description: string;
  tags?: string[];
  features?: any;
  thumbnailUrl?: string;
  themeCode: string;
  isShow: boolean;
  isPremium: boolean;
  minPlan: string;
  trialDays: number;
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
  isShow?: boolean;
  isPremium?: boolean;
  isDeleted?: boolean;
  minPlan?: string;
}
