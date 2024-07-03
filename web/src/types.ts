export type TActiveFilters = {
    group: string;
    subgroup: string;
}

export type TDropdown = {
  data: { [field: string]: string[] }, 
  activeFilters: TActiveFilters[], 
  setActiveFilters: (badges: TActiveFilters[]) => void
}

export type TFilterGroup = {
  activeFilters: TActiveFilters[], 
  name: string,
  setActiveFilters: (badges: TActiveFilters[]) => void, 
  subgroups?: string[]
}

export type TFilterSubgroupButton = {
  activeFilters: TActiveFilters[], 
  groupName: string, 
  subgroupName: string, 
  setActiveFilters: (badges: TActiveFilters[]) => void
};