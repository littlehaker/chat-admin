"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { useContext, useMemo } from "react";
import { ConfigContext } from "../../context/config-context";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import _ from "lodash";

// import { priorities, statuses } from "../data/data";
// import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const tableConfig = useContext(ConfigContext);
  const filterColumns = useMemo(() => {
    return tableConfig.columns.filter((x) => x.filterable);
  }, [tableConfig]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterColumns.map((column) => {
          const accessorKey = column.accessorKey;
          const label = column.label || _.capitalize(accessorKey);
          if (column.type === "text") {
            return (
              <Input
                placeholder={`Filter ${label}...`}
                value={
                  (table.getColumn(accessorKey)?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(accessorKey)
                    ?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
            );
          } else if (column.type === "enum") {
            return (
              <DataTableFacetedFilter
                column={table.getColumn(accessorKey)}
                title={label}
                options={column.enums}
              />
            );
          } else {
            return null;
          }
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
