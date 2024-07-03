import React, { useState } from "react";
import { TDropdown, TFilterGroup, TFilterSubgroupButton } from "./types";

function MenuSubgroup({
  activeFilters, 
  groupName, 
  subgroupName, 
  setActiveFilters
}: TFilterSubgroupButton) {    
  const [isChecked, setIsChecked] = useState<boolean>(activeFilters.reduce((acc, badge) => {
    if (badge.subgroup === subgroupName) {
      acc = true;
    }
    return acc;
  }, false));

  const handleClick = () => {
    if (!isChecked) {
      setActiveFilters([...activeFilters, { "group": groupName, "subgroup": subgroupName }])
    } else {
      setActiveFilters(activeFilters.filter((badge) => { return badge.subgroup !== subgroupName }));
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
        name={subgroupName} 
        id={subgroupName} 
        className="px-1 hover:cursor-pointer" 
        checked={isChecked} 
        onChange={() => {}} 
      />
      <label htmlFor={subgroupName} className="px-1 hover:cursor-pointer" onClick={handleClick}>{subgroupName}</label>
    </div>
  )
}

function MenuGroup({
  activeFilters, 
  name, 
  setActiveFilters, 
  subgroups = [] 
}: TFilterGroup) {
  const [showSubgroups, setShowSubgroups] = useState<boolean>(false);
  
  return (
    <li className="w-full">
      <button className="flex justify-left align-center w-full h-full hover:bg-sky-100" onClick={() => setShowSubgroups(true)}>
        <div className="mx-4">{name}</div>
      </button>

      {showSubgroups && (
        <>
          {subgroups.map((subgroupName) => {
            return (
              <React.Fragment key={subgroupName}>
                <MenuSubgroup activeFilters={activeFilters} setActiveFilters={setActiveFilters} groupName={name} subgroupName={subgroupName} />
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
}: TDropdown) {
  return (
    <menu className="relative flex flex-col align-left top-0 left-0 rounded-lg border bg-slate-50 w-64 py-2">
      {Object.keys(data).map((key) => {
        return (
          <React.Fragment key={key}>
            <MenuGroup activeFilters={activeFilters} setActiveFilters={setActiveFilters} name={key.charAt(0).toUpperCase() + key.slice(1)} subgroups={data[key]} />
          </React.Fragment>
        );
      })}
    </menu>
  );
}
