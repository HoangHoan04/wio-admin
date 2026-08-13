import type { BaseDto } from "./common";
import type { UserDto } from "./customer.dto";
import type { ServicePlanDto } from "./service-plan.dto";

export interface SubscriptionDto extends BaseDto {
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
