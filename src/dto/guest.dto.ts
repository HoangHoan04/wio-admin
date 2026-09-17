import type { BaseDto } from "./common";

/* ============================================================
 * GUEST GROUP
 * ============================================================ */
export interface GuestGroupDto extends BaseDto {
  invitationId: string;
  code: string;
  name: string;
  side?: string | null; // enumData.GUEST_SIDE
  sortOrder: number;
}

export interface CreateGuestGroupDto {
  code: string;
  name: string;
  side?: string;
  sortOrder?: number;
}

/* ============================================================
 * GUEST
 * ============================================================ */
export interface GuestDto extends BaseDto {
  invitationId: string;
  groupId?: string | null;
  tableId?: string | null;
  fullName: string;
  salutation?: string | null;
  isVip: boolean;
  invitationCode: string;
  qrCodeUrl?: string | null;
  rsvpStatus: string;
  attendingCount: number;
  needsTransport: boolean;
  rsvpNote?: string | null;
  rsvpAt?: string | null;
  invitedAt?: string | null;
  invitationViewedAt?: string | null;
  checkedInAt?: string | null;

  // Relations
  group?: GuestGroupDto;
  table?: TableDto;
  invitation?: { id: string; title: string; slug: string };
}

export interface CreateGuestDto {
  invitationId: string;
  tableId?: string;
  fullName: string;
  salutation?: string;
  groupId?: string;
  groupCode?: string;
  isVip?: boolean;
  invitationCode?: string;
  qrCodeUrl?: string;
  rsvpStatus?: string;
  attendingCount?: number;
  needsTransport?: boolean;
  rsvpNote?: string;
  rsvpAt?: string;
  invitedAt?: string;
  invitationViewedAt?: string;
}

export interface UpdateGuestDto extends Partial<CreateGuestDto> {
  id: string;
}

export interface FilterGuestDto {
  invitationId?: string;
  tableId?: string;
  groupId?: string;
  groupCode?: string;
  fullName?: string;
  salutation?: string;
  isVip?: boolean;
  invitationCode?: string;
  rsvpStatus?: string;
  attendingCount?: number;
  needsTransport?: boolean;
  isDeleted?: boolean;
}

export interface CreateManyGuestsDto {
  invitationId: string;
  guests: CreateGuestDto[];
}

export interface ImportGuestExcelDto {
  invitationId: string;
}

export interface GenerateQrGuestDto {
  id: string;
}

/* ============================================================
 * PUBLIC
 * ============================================================ */
export interface IdentifyGuestDto {
  invitationCode: string;
}

export interface RsvpGuestDto {
  invitationCode: string;
  rsvpStatus?: string;
  attendingCount?: number;
  needsTransport?: boolean;
  rsvpNote?: string;
}

/* ============================================================
 * STATS
 * ============================================================ */
export interface GuestStatsDto {
  totalGuests: number;
  rsvp: {
    pending: number;
    attending: number;
    declined: number;
    totalSeats: number;
  };
  recentGuests: GuestDto[];
}

/* ============================================================
 * TABLE
 * ============================================================ */
export interface TableDto extends BaseDto {
  invitationId: string;
  name: string;
  maxSeats: number;
  currentSeats: number;
  description?: string | null;
  positionX?: number | null;
  positionY?: number | null;
  guests?: GuestDto[];
}

export interface CreateTableDto {
  invitationId: string;
  name: string;
  maxSeats: number;
  description?: string;
  positionX?: number;
  positionY?: number;
}

export interface UpdateTableDto {
  id: string;
  name?: string;
  maxSeats?: number;
  description?: string;
  positionX?: number;
  positionY?: number;
}

export interface FilterTableDto {
  invitationId?: string;
  name?: string;
}

export interface AssignGuestDto {
  tableId: string;
  guestId: string;
}

export interface UnassignGuestDto {
  guestId: string;
}
