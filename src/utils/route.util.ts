import { ROUTES } from "@/common/constants";

export type RouteConfig = Record<string, any>;

export type RouteNode = {
  key: string;
  label: string;
  path?: string;
  icon?: any;
  parent?: string;
  parentKey?: string;
  isShow?: boolean;
};

export interface RouteDetail {
  key: string;
  label: string;
  path: string;
  icon?: any;
  isShow?: boolean;
}

const MAX_MENU_DEPTH = 3;

export const isRouteObject = (val: any): boolean => {
  if (typeof val !== "object" || val === null || Array.isArray(val))
    return false;
  if (val.$$typeof) return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
};

export const buildRouteTree = (
  routes: RouteConfig,
  parentKey?: string,
): Record<string, RouteNode> => {
  const tree: Record<string, RouteNode> = {};

  const traverse = (
    obj: RouteConfig,
    parentPath = "",
    parentKeyVal?: string,
  ) => {
    Object.values(obj).forEach((item: any) => {
      if (!item.key && !item.groupName) {
        traverse(item, parentPath, parentKeyVal);
        return;
      }
      if (item.groupName) {
        if (item.children) {
          traverse(item.children, parentPath, parentKeyVal);
        }
        Object.keys(item).forEach((k) => {
          if (k !== "children" && isRouteObject(item[k])) {
            traverse({ [k]: item[k] }, parentPath, parentKeyVal);
          }
        });
        return;
      }

      if (item.key) {
        const nodeKey = item.key;
        tree[nodeKey] = {
          key: item.key,
          label: item.label,
          path: item.path,
          icon: item.icon,
          parent: parentPath || undefined,
          parentKey: parentKeyVal,
          isShow: item.isShow ?? true,
        };
      }

      if (item.children) {
        traverse(item.children, item.path || parentPath, item.key);
      }
    });
  };

  traverse(routes, "", parentKey);
  return tree;
};

export const getTabbableRoutes = (routes: RouteConfig): RouteNode[] => {
  const result: RouteNode[] = [];

  const traverse = (obj: RouteConfig, parentKey?: string) => {
    Object.values(obj).forEach((item: any) => {
      if (!item.key && !item.groupName) {
        traverse(item, parentKey);
        return;
      }
      if (item.groupName) {
        if (item.children) traverse(item.children, parentKey);
        Object.keys(item).forEach((k) => {
          if (k !== "children" && isRouteObject(item[k])) {
            traverse({ [k]: item[k] }, parentKey);
          }
        });
        return;
      }

      if (item.path && !item.path.includes(":") && item.key) {
        result.push({
          key: item.key,
          label: item.label,
          path: item.path,
          icon: item.icon,
          parentKey,
          isShow: item.isShow ?? true,
        });
      }

      if (item.children) {
        traverse(item.children, item.key);
      }
    });
  };

  traverse(routes);
  return result;
};

export const findRouteByKey = (
  routes: RouteConfig,
  key: string,
): any | null => {
  const search = (searchObj: any): any => {
    for (const value of Object.values(searchObj)) {
      const item = value as any;
      if (!item.key && !item.groupName) {
        const result = search(item);
        if (result) return result;
        continue;
      }
      if (item.groupName) {
        if (item.children) {
          const result = search(item.children);
          if (result) return result;
        }
        for (const k of Object.keys(item)) {
          if (k !== "children" && isRouteObject(item[k])) {
            const result = search({ [k]: item[k] });
            if (result) return result;
          }
        }
        continue;
      }
      if (item.key === key) return item;
      if (item.children) {
        const result = search(item.children);
        if (result) return result;
      }
    }
    return null;
  };
  return search(routes);
};

export const findRouteByPath = (
  routes: RouteConfig,
  path: string,
  parentKey?: string,
): any | null => {
  let result: any = null;

  const traverse = (obj: RouteConfig, parentKeyVal?: string) => {
    Object.values(obj).forEach((item: any) => {
      if (!item.key && !item.groupName) {
        traverse(item, parentKeyVal);
        return;
      }
      if (item.groupName) {
        if (item.children) traverse(item.children, parentKeyVal);
        Object.keys(item).forEach((k) => {
          if (k !== "children" && isRouteObject(item[k])) {
            traverse({ [k]: item[k] }, parentKeyVal);
          }
        });
        return;
      }
      if (item.path === path) {
        result = { ...item, parentKey: parentKeyVal };
        return;
      }
      if (item.children) {
        traverse(item.children, item.key);
      }
    });
  };

  traverse(routes, parentKey);
  return result;
};

export const getAllRoutePatterns = (routes: RouteConfig): string[] => {
  const patterns: string[] = [];

  const traverse = (obj: RouteConfig) => {
    Object.values(obj).forEach((item: any) => {
      if (!item.key && !item.groupName) {
        traverse(item);
        return;
      }
      if (item.groupName) {
        if (item.children) traverse(item.children);
        Object.keys(item).forEach((k) => {
          if (k !== "children" && isRouteObject(item[k])) {
            traverse({ [k]: item[k] });
          }
        });
        return;
      }
      if (item.path) {
        patterns.push(item.path);
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(routes);
  return patterns;
};

export const matchPathToPattern = (
  pathname: string,
  pattern: string,
): boolean => {
  const pathParts = pathname.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);

  if (pathParts.length !== patternParts.length) return false;

  return pathParts.every((part, idx) => {
    const patternPart = patternParts[idx];
    return patternPart === part || patternPart.startsWith(":");
  });
};

export const findMatchingRoutePattern = (
  pathname: string,
  routes: RouteConfig,
): any | null => {
  let bestMatch: any = null;
  let maxDepth = -1;

  const traverse = (obj: RouteConfig, depth: number, parentKey?: string) => {
    Object.values(obj).forEach((item: any) => {
      if (!item.key && !item.groupName) {
        traverse(item, depth, parentKey);
        return;
      }
      if (item.groupName) {
        if (item.children) traverse(item.children, depth, parentKey);
        Object.keys(item).forEach((k) => {
          if (k !== "children" && isRouteObject(item[k])) {
            traverse({ [k]: item[k] }, depth, parentKey);
          }
        });
        return;
      }
      if (item.path) {
        const isMatch = matchPathToPattern(pathname, item.path);

        if (isMatch) {
          const hasNoChildren =
            !item.children || Object.keys(item.children).length === 0;

          if (depth > maxDepth || (depth === maxDepth && hasNoChildren)) {
            bestMatch = { ...item, parentKey };
            maxDepth = depth;
          }
        }
      }

      if (item.children) {
        traverse(item.children, depth + 1, item.key);
      }
    });
  };

  traverse(routes, 0);
  return bestMatch;
};

export const convertRoutesToMenuItems = (
  routes: RouteConfig,
  _parentKey?: string,
  currentDepth: number = 1,
): any[] => {
  const items: any[] = [];
  if (currentDepth > 4) return items;

  Object.values(routes).forEach((item: any) => {
    if (!item.key && !item.groupName) {
      items.push(...convertRoutesToMenuItems(item, _parentKey, currentDepth));
      return;
    }
    if (item.groupName) {
      items.push({
        isGroup: true,
        groupName: item.groupName,
        isShow: true,
      });
      if (item.children) {
        items.push(
          ...convertRoutesToMenuItems(item.children, _parentKey, currentDepth),
        );
      }
      const otherKeys: RouteConfig = {};
      Object.keys(item).forEach((k) => {
        if (k !== "children" && isRouteObject(item[k])) {
          otherKeys[k] = item[k];
        }
      });
      if (Object.keys(otherKeys).length > 0) {
        items.push(
          ...convertRoutesToMenuItems(otherKeys, _parentKey, currentDepth),
        );
      }
      return;
    }

    const isShow = item.isShow ?? true;

    if (item.key && isShow) {
      const menuItem: any = {
        key: item.key,
        id: item.key.toLowerCase(),
        label: item.label,
        icon: item.icon,
        isShow: isShow,
      };

      if (item.path && !item.path.includes(":")) {
        menuItem.path = item.path;
      }

      if (
        item.children &&
        Object.keys(item.children).length > 0 &&
        currentDepth < 3
      ) {
        const childItems = convertRoutesToMenuItems(
          item.children,
          item.key,
          currentDepth + 1,
        );

        if (childItems.length > 0) {
          menuItem.children = childItems;
        } else {
          if (!menuItem.path) {
            return;
          }
        }
      }

      items.push(menuItem);
    }
  });

  return items;
};

export const getVisibleRoutes = (routes: RouteConfig): RouteNode[] => {
  const result: RouteNode[] = [];

  const traverse = (
    obj: RouteConfig,
    depth: number = 1,
    parentKey?: string,
  ) => {
    if (depth > MAX_MENU_DEPTH) return;

    Object.values(obj).forEach((item: any) => {
      if (!item.key && !item.groupName) {
        traverse(item, depth, parentKey);
        return;
      }
      if (item.groupName) {
        if (item.children) traverse(item.children, depth, parentKey);
        Object.keys(item).forEach((k) => {
          if (k !== "children" && isRouteObject(item[k])) {
            traverse({ [k]: item[k] }, depth, parentKey);
          }
        });
        return;
      }

      const isShow = item.isShow ?? true;

      if (item.key && isShow) {
        result.push({
          key: item.key,
          label: item.label,
          path: item.path,
          icon: item.icon,
          parentKey,
          isShow: isShow,
        });

        if (item.children) {
          traverse(item.children, depth + 1, item.key);
        }
      }
    });
  };

  traverse(routes);
  return result;
};

export const getAllRoutes = (): RouteDetail[] => {
  const list: RouteDetail[] = [];
  const traverse = (obj: any) => {
    Object.values(obj).forEach((item: any) => {
      if (!item.key && !item.groupName) {
        traverse(item);
        return;
      }
      if (item.groupName) {
        if (item.children) traverse(item.children);
        Object.keys(item).forEach((k) => {
          if (k !== "children" && isRouteObject(item[k])) {
            traverse({ [k]: item[k] });
          }
        });
        return;
      }
      if (item.key) {
        list.push({
          key: item.key,
          label: item.label,
          path: item.path,
          icon: item.icon,
          isShow: item.isShow ?? true,
        });
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };
  traverse(ROUTES);
  return list;
};

export const getRouteByPath = (path: string): RouteDetail | undefined => {
  const found = findRouteByPath(ROUTES, path);
  if (found) {
    return {
      key: found.key,
      label: found.label,
      path: found.path,
      icon: found.icon,
      isShow: found.isShow ?? true,
    };
  }
  return undefined;
};
