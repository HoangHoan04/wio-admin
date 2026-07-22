import type { BaseDto } from "./common";
import type { UserDto } from "./customer.dto";
import type { ServicePlanDto } from "./service-plan.dto";
import type { WeddingDto } from "./wedding.dto";

export interface SubscriptionDto extends BaseDto {
  weddingId: string;
  wedding?: WeddingDto;
  userId: string;
  user?: UserDto;
  planId: string;
  plan?: ServicePlanDto;
  status: string;
  startedAt: string;
  expiresAt: string;
  paidAmountVnd?: number;
  paymentMethod?: string;
  paymentRef?: string;
}

export interface FilterSubscriptionDto {
  userId?: string;
  weddingId?: string;
  planId?: string;
  status?: string;
}

export interface AdminChangeSubscriptionPlanDto {
  subscriptionId: string;
  planId: string;
  expiresAt: string;
  paidAmountVnd?: number;
  paymentMethod?: string;
  paymentRef?: string;
}
