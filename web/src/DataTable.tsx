import {
  AccessorFn,
  Row,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import cx from "classnames";
import { Menu } from "./Menu";
import { useEffect, useRef, useState } from "react";
import { IconListBullet } from "./Icons/IconListBullet";
import { TActiveFilters } from "./types";
import { IconXMark } from "./Icons/IconXMark";
import { pluralize } from "./utils";

type Props<RowType> = {
  className?: string;
  data: RowType[];
  schema: {
    cellRenderer: AccessorFn<RowType>;
    headerName: string;
    sortingFunction?: (rowA: Row<RowType>, rowB: Row<RowType>) => number;
  }[];
  fullWidth?: boolean;
  onRowClick?: (row: RowType) => void;
  initialSortState?: SortingState;
};
type TData = {
  [field: string] : string;
}

export function DataTable<RowType extends TData>({
  className,
  data,
  schema,
  fullWidth,
  onRowClick,
  initialSortState,
}: Props<RowType>) {
  const [rowData, _setData] = useState(() => [...data]);
  const [sorting, setSorting] = useState<SortingState>(initialSortState || []);
  const [filteredRowData, setFilteredRowData] = useState([...rowData]);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<TActiveFilters[]>([]);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    if(activeFilters.length === 0) {
      setFilteredRowData(rowData);
    } else {
      const filters: {[field: string]: string[]} = {"importance": [], "type": [], "customer": []};
      for(let f of activeFilters) {
        if(filters[f.group.toLowerCase()]) {
          filters[f.group.toLowerCase()] = [...filters[f.group.toLowerCase()], f.subgroup];
        } else {
          filters[f.group.toLowerCase()] = [f.subgroup];
        }
      }

      let output: RowType[] = rowData.filter(item => {
        return Object.keys(filters).every(key => {
          if (filters[key].length === 0) {
            return true;
          }
          return filters[key].includes(item[key]);
        })});
        setFilteredRowData(output);
      }
  }, [activeFilters]);

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const filterTypes = ["importance", "type", "customer"]
  const filterMenuData: any = {};

  rowData.forEach(item => {
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

  const handleHideDropdown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowFilterMenu(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
      setShowFilterMenu(false);
    }
  };

  const columnHelper = createColumnHelper<RowType>();

  const columns = schema.map((columnSchema) =>
    columnHelper.accessor(columnSchema.cellRenderer, {
      header: columnSchema.headerName,
      cell: (info) => info.renderValue(),
      sortingFn: columnSchema.sortingFunction,
      enableSorting: !!columnSchema.sortingFunction,
      sortUndefined: "last",
    })
  );

  const table = useReactTable({
    data: filteredRowData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="relative flex items-center w-full">
        <button 
          className="my-2 rounded-md bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" 
          onClick={() => {setShowFilterMenu(true)}}
        >
          <div className="flex justify-center align-center">
            <IconListBullet style="mx-1"/>
            <div className="font-semibold">Filter</div>
          </div>
        </button>
        
        <>
          {Object.entries(activeFilters.reduce((acc: {[type: string]: number}, badge) => {
            if(acc[badge.group]) {
              acc[badge.group]++;
            } else {
              acc[badge.group] = 1;
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
                  onClick={() => setActiveFilters([...activeFilters.filter((badge)=> {return badge.group !== group})])}
                > 
                  <IconXMark /> 
                </button>
              </div>
            );
          })}
          {activeFilters.length > 0 && <div>Results: {filteredRowData.length}</div>}
        </>

        <div ref={filterMenuRef} className="absolute top-14 left-0 z-50">
          {showFilterMenu && <Menu activeFilters={activeFilters} setActiveFilters={setActiveFilters} data={filterMenuData}/>} 
        </div>
      </div>

      <div className="hide-scroll-bar h-full overflow-hidden overflow-y-auto rounded-lg border bg-white">
        <table className={cx({ "w-full": fullWidth }, className, " bg-white")}>
          <thead className="border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="bg-white sticky border-b  px-6 text-left font-semibold hover:cursor-default"
                    style={{ height: 64, top: 0 }}
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === "asc"
                          ? "Sort ascending"
                          : header.column.getNextSortingOrder() === "desc"
                          ? "Sort descending"
                          : "Clear sort"
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody style={{ overflow: "auto" }}>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:cursor-default hover:bg-gray-100"
                onMouseDown={(e) => e.button === 0 && onRowClick?.(row.original)}
                style={{ height: 64 }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b px-6"
                    style={{ height: 64 }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
