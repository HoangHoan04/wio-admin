import type { BaseDto } from "./common";

export interface ContactDto extends BaseDto {
  code?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: string;
  adminNote?: string | null;
  respondedAt?: string | null;
  respondedBy?: string | null;
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
