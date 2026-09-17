import type { BaseDto } from "./common";

export interface StockAssetDto extends BaseDto {
  title: string;
  category: string; // enumData.STOCK_ASSET_CATEGORY
  tags?: string[];
  src: string;
  thumb?: string | null;
  kind: string; // enumData.STOCK_ASSET_KIND
  license?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateStockAssetDto {
  title: string;
  category: string;
  kind: string;
  tags?: string[];
  src: string;
  thumb?: string;
  license?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateStockAssetDto extends Partial<CreateStockAssetDto> {
  id: string;
}

export interface FilterStockAssetDto {
  title?: string;
  category?: string;
  kind?: string;
  isActive?: boolean;
}

export interface PublicStockAssetListDto {
  q?: string;
  category?: string;
  kind?: string;
  skip?: number;
  take?: number;
}
