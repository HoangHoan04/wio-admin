import type { BaseDto, FilterItemSelect, FilterItemText } from "./common";
import type { UserDto } from "./customer.dto";
import type { WeddingDto } from "./wedding.dto";

export interface SubscriptionDto extends BaseDto {
  weddingId: string;
  wedding?: WeddingDto;
  userId: string;
  user?: UserDto;
  planName: string;
  status: string; // ACTIVE, EXPIRED, CANCELLED, PENDING
  startDate: Date;
  endDate: Date;
  price: number;
}

export interface FilterSubscriptionDto {
  planName?: FilterItemText;
  status?: FilterItemSelect;
}
