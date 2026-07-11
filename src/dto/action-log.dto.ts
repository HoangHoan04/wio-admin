import type { BaseDto } from "./common/base.dto";

export interface ActionLogDto extends BaseDto {
  createdById: string;
  createdByCode: string;
  createdByName: string;
  createdNote?: string;
  actionType?: string;
  entityId?: string;
  entityName?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

export interface ActionLogFilterDto {
  createdByCode?: string;
  createdByName?: string;
  actionType?: string;
  entityName?: string;
  entityId?: string;
}
