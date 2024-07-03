import React, { useState } from "react";
import { TFilterMenu, TFilterGroup, TFilterSubgroupButton } from "../types";

function MenuGroupItem({
  activeFilters, 
  groupName, 
  groupItem,
  setActiveFilters
}: TFilterSubgroupButton) {    
  const [isChecked, setIsChecked] = useState<boolean>(activeFilters.reduce((acc, filter) => {
    if (filter.item === groupItem) {
      acc = true;
    }
    return acc;
  }, false));

  const handleClick = () => {
    if (!isChecked) {
      setActiveFilters([...activeFilters, { "group": groupName, "item": groupItem }])
    } else {
      setActiveFilters(activeFilters.filter((filter) => { return filter.item !== groupItem }));
    }
    setIsChecked(!isChecked);
  }

  return (
    <div 
      className="flex justify-left align-center w-full h-full px-8 hover:cursor-pointer hover:bg-sky-100" 
      onClick={handleClick}
    >
      <input 
        type="checkbox" 
        name={groupItem} 
        id={groupItem} 
        className="px-1 hover:cursor-pointer" 
        checked={isChecked} 
        onChange={() => {}} 
      />
      <label htmlFor={groupItem} className="px-1 hover:cursor-pointer" onClick={handleClick}>{groupItem}</label>
    </div>
  )
}

function MenuGroup({
  activeFilters, 
  name, 
  setActiveFilters, 
  groupItems = [] 
}: TFilterGroup) {
  const [showGroupItems, setShowGroupItems] = useState<boolean>(false);
  
  return (
    <li className="w-full">
      <button className="flex justify-left align-center w-full h-full hover:bg-sky-100" onClick={() => setShowGroupItems(true)}>
        <div className="mx-4">{name}</div>
      </button>

      {showGroupItems && (
        <>
          {groupItems.map((item) => {
            return (
              <React.Fragment key={item}>
                <MenuGroupItem activeFilters={activeFilters} setActiveFilters={setActiveFilters} groupName={name} groupItem={item} />
              </React.Fragment>
            );
          })}
        </>
      )}
    </li>
  );
}

export function Menu({
  data, 
  activeFilters, 
  setActiveFilters
}: TFilterMenu) {
  return (
    <menu className="relative flex flex-col align-left top-0 left-0 rounded-lg border bg-slate-50 w-64 py-2">
      {Object.keys(data).map((key) => {
        return (
          <React.Fragment key={key}>
            <MenuGroup activeFilters={activeFilters} setActiveFilters={setActiveFilters} name={key.charAt(0).toUpperCase() + key.slice(1)} groupItems={data[key]} />
          </React.Fragment>
        );
      })}
    </menu>
  );
}
