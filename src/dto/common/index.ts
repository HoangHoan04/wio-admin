export interface BaseDto {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string | null;
  updatedBy?: string | null;
  isDeleted: boolean;
  statusColor?: string;
  statusName?: string;
  status?: string;
}
export interface PaginationDto<T> {
  skip: number;
  take: number;
  where: T;
}

type TOperatorText = "=" | "LIKE" | "NOT LIKE";
type TOperatorNumber = "=" | "!=" | "<" | ">" | ">=" | "<=";
type TOperatorDate = "=" | "!=" | "<" | ">" | ">=" | "<=";
type TOperatorSelect = "IN" | "NOT IN";
type TOperatorBoolean = "=";

export interface FilterItemText {
  type: "TEXT";
  value: string;
  compare?: TOperatorText;
}

export interface FilterItemNumber {
  type: "NUMBER";
  value: number | undefined;
  compare?: TOperatorNumber;
}

export interface FilterItemDate {
  type: "DATE";
  value: Date | undefined;
  compare?: TOperatorDate;
}

export interface FilterItemBoolean {
  type: "BOOLEAN";
  value?: boolean | "";
  compare?: TOperatorBoolean;
}

export interface FilterItemSelect {
  type: "SELECT";
  value: unknown[];
  compare?: TOperatorSelect;
}

export type OrderOption<T = unknown> = {
  [k in keyof T]?: "ASC" | "DESC" | "";
};

export interface PageResponse<T = any> {
  data: T[];
  total: number;
}

export interface SuccessResponse<T = any> {
  message: string;
  data: T;
}
