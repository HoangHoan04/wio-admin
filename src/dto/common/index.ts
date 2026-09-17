export interface BaseDto {
  id: string;
  createdAt: string;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  isDeleted: boolean;
}

/* ============================================================
 * PAGINATION
 * ============================================================ */
export interface PaginationDto<TWhere = Record<string, unknown>> {
  skip: number;
  take: number;
  where?: TWhere;
  order?: Record<string, "ASC" | "DESC">;
}

export interface PageResponse<T = unknown> {
  data: T[];
  total: number;
}

export interface SuccessResponse<T = unknown> {
  message: string;
  data: T;
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

/* ============================================================
 * ID DTO (dùng chung cho các endpoint find-by-id/delete)
 * ============================================================ */
export interface IdDto {
  id: string;
}
