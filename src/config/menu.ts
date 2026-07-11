import { ROUTES } from "@/common/constants";
import { convertRoutesToMenuItems } from "@/utils";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  children?: MenuItem[];
  isGroup?: boolean;
  groupName?: string;
}

export const menuItems: MenuItem[] = convertRoutesToMenuItems(
  ROUTES,
) as MenuItem[];
