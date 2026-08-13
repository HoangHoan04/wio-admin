import type { BaseDto, FilterItemBoolean, FilterItemText } from "./common";

export interface StockAssetDto extends BaseDto {
  title: string;
  category: string;
  tags?: string[];
  src: string;
  thumb?: string;
  kind: string;
  license?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateStockAssetDto {
  title: string;
  category: string;
  tags?: string[];
  src: string;
  thumb?: string;
  kind: string;
  license?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateStockAssetDto extends Partial<CreateStockAssetDto> {
  id: string;
}

export interface FilterStockAssetDto {
  title?: string | FilterItemText;
  category?: string | FilterItemText;
  kind?: string | FilterItemText;
  isActive?: boolean | FilterItemBoolean;
}
