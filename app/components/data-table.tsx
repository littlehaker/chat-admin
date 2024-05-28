"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { ConfigContext } from "../context/config-context";
import { Checkbox } from "@radix-ui/react-checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import _ from "lodash";

function renderEnums(value, enums) {
  const enumItem = enums.find((x) => x.value === value);

  const display = enumItem?.label || _.capitalize(value);
  return <Badge variant={enumItem?.variant || "default"}>{display}</Badge>;
}

function makeColumn(columnConfig) {
  const ret = {
    accessorKey: columnConfig.accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnConfig.label || _.capitalize(columnConfig.accessorKey)}
      />
    ),
    cell: ({ row }) => {
      // TODO: different type render
      return (
        <div>
          {columnConfig.type === "text" &&
            row.getValue(columnConfig.accessorKey)}
          {columnConfig.type === "enum" &&
            renderEnums(
              row.getValue(columnConfig.accessorKey),
              columnConfig.enums
            )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
  if (columnConfig.type === "enum") {
    ret.filterFn = (row, id, value) => {
      return value.includes(row.getValue(id));
    };
  }
  return ret;
}

interface DataTableProps<TData, TValue> {
  // columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  // columns,
  data,
}: DataTableProps<TData, TValue>) {
  const tableConfig = React.useContext(ConfigContext);

  const columns = React.useMemo(() => {
    const ret = tableConfig.columns.map((x) => makeColumn(x));

    if (tableConfig.bulkActions?.length) {
      ret.unshift({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    if (tableConfig.rowActions.length) {
      ret.push({
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
      });
    }

    return ret;
  }, [tableConfig]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pagination={tableConfig.pagination} />
    </div>
  );
}
