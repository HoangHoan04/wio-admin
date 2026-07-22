import type { BaseDto } from "./common";

export interface ServicePlanDto extends BaseDto {
  name: string;
  maxGuests: number;
  maxPhotos: number;
  maxTemplates: number;
  hasAi: boolean;
  hasAnalytics: boolean;
  hasCustomSlug: boolean;
  durationDays: number;
  priceVnd: number;
  isActive: boolean;
}

export interface FilterServicePlanDto {
  name?: string;
  isActive?: boolean;
}

export interface CreateServicePlanDto {
  name: string;
  maxGuests: number;
  maxPhotos: number;
  maxTemplates: number;
  hasAi?: boolean;
  hasAnalytics?: boolean;
  hasCustomSlug?: boolean;
  durationDays: number;
  priceVnd: number;
  isActive?: boolean;
}

export interface UpdateServicePlanDto extends CreateServicePlanDto {
  id: string;
}
