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
import { useEffect, useRef, useState } from "react";
import { TDataTableRow } from "./types";
import { Filter } from "./Components/Filter";

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

export function DataTable<RowType extends TDataTableRow>({
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
  const filterMenuRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
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
      <Filter 
        ref={filterMenuRef} 
        data={rowData}
        showMenu={showFilterMenu} 
        setShowFilterMenu={setShowFilterMenu}
        setFilteredRowData={setFilteredRowData}
      />

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
