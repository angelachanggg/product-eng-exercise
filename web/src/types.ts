export type TDataTableRow = {
  [field: string] : string;
}

export type TActiveFilters = {
    group: string;
    item: string;
}

export type TFilter = {
  data: TDataTableRow[];
  showMenu: boolean;
  setShowFilterMenu: (maybeShow: boolean) => void;
  setFilteredRowData: (rowData: any[]) => void;
}

export type TFilterMenu = {
  data: { [field: string]: string[] }, 
  activeFilters: TActiveFilters[], 
  setActiveFilters: (badges: TActiveFilters[]) => void
}

export type TFilterGroup = {
  activeFilters: TActiveFilters[], 
  name: string,
  setActiveFilters: (badges: TActiveFilters[]) => void, 
  groupItems?: string[]
}

export type TFilterSubgroupButton = {
  activeFilters: TActiveFilters[], 
  groupName: string, 
  groupItem: string, 
  setActiveFilters: (badges: TActiveFilters[]) => void
};

export type TIcon = {
  style?: string;
}