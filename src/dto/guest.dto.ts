import type { BaseDto } from "./common";

export interface GuestDto extends BaseDto {
  invitationId?: string;
  tableId?: string;
  fullName: string;
  salutation?: string;
  side: string;
  isVip: boolean;
  invitationCode: string;
  qrCodeUrl?: string;
  rsvpStatus: string;
  attendingCount: number;
  needsTransport: boolean;
  rsvpNote?: string;
  rsvpAt?: string;
  invitedAt?: string;
  invitationViewedAt?: string;
}

export interface FilterGuestDto {
  invitationId?: string;
  groupId?: string;
  tableId?: string;
  fullName?: string;
  salutation?: string;
  side?: string;
  isVip?: boolean;
  invitationCode?: string;
  rsvpStatus?: string;
  attendingCount?: number;
  needsTransport?: boolean;
  rsvpNote?: string;
  isDeleted?: boolean;
}

export interface GuestStatsDto {
  total: number;
  attending: number;
  declined: number;
  pending: number;
  attendingGuests: number;
  needsTransport: number;
}

export type GuestApiTypes = GuestDto | FilterGuestDto | GuestStatsDto;
