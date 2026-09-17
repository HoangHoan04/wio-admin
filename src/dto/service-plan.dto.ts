import type { BaseDto } from "./common";

export interface ServicePlanDto extends BaseDto {
  name: string;
  code: string; // enumData.SERVICE_PLAN_CODE
  maxInvitations: number;
  maxGuests: number;
  maxPhotos: number;
  maxTemplates?: number;
  hasAi: boolean;
  hasAnalytics: boolean;
  hasCustomSlug: boolean;
  hasCustomDesign: boolean;
  durationDays: number;
  priceVnd: number;
  isActive: boolean;
  sortOrder: number;
}

export interface CreateServicePlanDto {
  name: string;
  code: string;
  maxInvitations: number;
  maxGuests: number;
  maxPhotos: number;
  hasAi: boolean;
  hasAnalytics: boolean;
  hasCustomSlug: boolean;
  hasCustomDesign: boolean;
  durationDays: number;
  priceVnd: number;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateServicePlanDto extends Partial<CreateServicePlanDto> {
  id: string;
}

export interface FilterServicePlanDto {
  name?: string;
  code?: string;
  hasAi?: boolean;
  hasAnalytics?: boolean;
  hasCustomSlug?: boolean;
  hasCustomDesign?: boolean;
  isActive?: boolean;
  priceVndMin?: number;
  priceVndMax?: number;
}

export interface SelectBoxServicePlanDto {
  id: string;
  code: string;
  name: string;
  priceVnd: number;
}
