import type { BaseDto, FilterItemText, FilterItemSelect } from "./common";
import type { IWedding } from "./wedding.dto";
import type { IUser } from "./user.dto";

export interface ISubscription extends BaseDto {
  weddingId: string;
  wedding?: IWedding;
  userId: string;
  user?: IUser;
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
