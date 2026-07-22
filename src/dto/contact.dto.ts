import type { BaseDto } from "./common";

export interface ContactDto extends BaseDto {
  code?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  adminNote?: string;
  respondedAt?: string;
  respondedBy?: string;
  createdById?: string;
}

export interface FilterContactDto {
  code?: string;
  name?: string;
  email?: string;
  status?: string;
}

export interface UpdateContactStatusDto {
  id: string;
  status: string;
  adminNote?: string;
}
