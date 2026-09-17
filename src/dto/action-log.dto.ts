import type { BaseDto } from "./common";

export interface ActionLogDto extends BaseDto {
  createdById: string;
  createdByCode: string;
  createdByName: string;
  createdNote?: string | null;
  actionType?: string | null;
  entityId?: string | null;
  entityName?: string | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  location?: string | null;
}

export interface ActionLogFilterDto {
  entityId?: string;
  entityName?: string;
  createdById?: string;
  createdByName?: string;
  actionType?: string;
}
