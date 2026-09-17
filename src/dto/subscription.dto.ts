import type { BaseDto } from "./common";
import type { UserDto } from "./customer.dto";
import type { ServicePlanDto } from "./service-plan.dto";

export interface SubscriptionDto extends BaseDto {
  userId: string;
  planId: string;
  status: string;
  startedAt: string;
  expiresAt: string;
  user?: UserDto;
  plan?: ServicePlanDto;
  paidAmountVnd?: number;
  paymentMethod?: string;
  paymentRef?: string;
}

export interface CreateSubscriptionDto {
  userId: string;
  planId: string;
  status?: string;
  startedAt?: string;
  expiresAt?: string;
}

export interface UpdateSubscriptionDto extends Partial<CreateSubscriptionDto> {
  id: string;
}

export interface FilterSubscriptionDto {
  userId?: string;
  planId?: string;
  status?: string;
  isActive?: boolean;
}

export interface AdminChangeSubscriptionPlanDto {
  subscriptionId: string;
  planId: string;
  expiresAt: string;
}
