import type { BaseDto } from "./common";

export interface NotificationDto extends BaseDto {
  invitationId: string;
  guestId?: string;
  channel: string; // EMAIL | SMS | PUSH | ZALO
  type: string; // INVITE | REMINDER | THANK_YOU | RSVP_CONFIRM
  subject?: string;
  content: string;
  status: string; // PENDING | SENT | FAILED | CANCELLED
  scheduledAt: string;
  sentAt?: string;
  failedReason?: string;
  provider?: string;
  providerMsgId?: string;
  invitation?: {
    id: string;
    title: string;
    slug: string;
  };
  guest?: {
    id: string;
    fullName: string;
    phone?: string;
    email?: string;
  };
}

export interface FilterNotificationDto {
  invitationId?: string;
  guestId?: string;
  channel?: string;
  type?: string;
  status?: string;
}
