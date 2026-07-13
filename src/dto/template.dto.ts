import type { BaseDto, FilterItemBoolean, FilterItemText } from "./common";

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

export interface FilterTemplateDto {
  name?: string | FilterItemText;
  themeCode?: string | FilterItemText;
  isShow?: boolean | FilterItemBoolean;
  isPremium?: boolean | FilterItemBoolean;
  minPlan?: string;
}
