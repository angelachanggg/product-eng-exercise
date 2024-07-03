import { forwardRef, useEffect, useState } from "react";
import { IconListBullet } from "../Icons/IconListBullet";
import { pluralize } from "../utils";
import { TActiveFilters, TDataTableRow, TFilter, TFilterMenu } from "../types";
import { IconXMark } from "../Icons/IconXMark";
import { Menu } from "./Menu";

function getMenuGroups(data: TDataTableRow[]): TFilterMenu["data"] {
  const filterTypes = ["importance", "type", "customer"]
  const filterMenuData: any = {};

  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if(filterTypes.includes(key)) {
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

export const Filter = forwardRef<HTMLDivElement, TFilter>(({data, showMenu, setShowFilterMenu, setFilteredRowData}, ref) => {
  const [activeFilters, setActiveFilters] = useState<TActiveFilters[]>([]);
  const [results, setResults] = useState<number>(data.length);

  const menuData: TFilterMenu["data"] = getMenuGroups(data);

  useEffect(() => {
    if(activeFilters.length === 0) {
      setFilteredRowData(data);
    } else {
      const filters: {[field: string]: string[]} = {"importance": [], "type": [], "customer": []};
      for(let f of activeFilters) {
        if(filters[f.group.toLowerCase()]) {
          filters[f.group.toLowerCase()] = [...filters[f.group.toLowerCase()], f.item];
        } else {
          filters[f.group.toLowerCase()] = [f.item];
        }
      }

      let output: TDataTableRow[] = data.filter(item => {
        return Object.keys(filters).every(key => {
          if (filters[key].length === 0) {
            return true;
          }
          return filters[key].includes(item[key]);
        })});
        setFilteredRowData(output);
        setResults(output.length);
      }
  }, [activeFilters]);

    return (
      <div className="relative flex items-center w-full">
        <button 
          className="my-2 rounded-md bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" 
          onClick={() => {setShowFilterMenu(!showMenu)}}
        >
          <div className="flex justify-center align-center">
            <IconListBullet style="mx-1"/>
            <div className="font-semibold">Filter</div>
          </div>
        </button>
        
        <>
          {Object.entries(activeFilters.reduce((acc: {[type: string]: number}, filter) => {
            if(acc[filter.group]) {
              acc[filter.group]++;
            } else {
              acc[filter.group] = 1;
            }
            return acc;
          }, {})).map(([group, count]) => { 
            return (
              <div 
                key={group} 
                className="mx-2 my-2 flex content-center items-center rounded-md bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <div>{`${count} ${pluralize(group)}`}</div>
                <button 
                  className="flex content-center items-center" 
                  onClick={() => setActiveFilters([...activeFilters.filter((filter)=> {return filter.group !== group})])}
                > 
                  <IconXMark /> 
                </button>
              </div>
            );
          })}
          {activeFilters.length > 0 && <div>Results: {results}</div>}
        </>

        <div ref={ref} className="absolute top-14 left-0 z-50">
          {showMenu && <Menu activeFilters={activeFilters} setActiveFilters={setActiveFilters} data={menuData}/>} 
        </div>
      </div>
    );
})