import { TDataTableRow, TFilterMenu } from "./types";

export function getMenuGroups(data: TDataTableRow[], filterGroups: string[]): TFilterMenu["data"] {
  const filterMenuData: any = {};

  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if(filterGroups.includes(key)) {
        if (!filterMenuData[key]) {
          filterMenuData[key] = new Set();
        }
        filterMenuData[key].add(item[key]);
      }
    });
  });

  Object.keys(filterMenuData).forEach(key => {
    filterMenuData[key] = Array.from(filterMenuData[key]);
  });
  return filterMenuData;
}

export function pluralize(word: string) {
    return word.slice(-1) === "s" ? word+"es" : word+"s";
}
