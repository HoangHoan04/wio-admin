export const getEnumOptions = (enumObject: any) => {
  return Object.values(enumObject).map((item: any) => ({
    id: item.code,
    value: item.code,
    name: item.name,
  }));
};

export const getEnumName = (enumObject: any, code: string) => {
  const item = Object.values(enumObject).find(
    (i: any) => i.code === code,
  ) as any;
  return item?.name;
};
