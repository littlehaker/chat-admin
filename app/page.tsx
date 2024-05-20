"use client";

import { DataTable } from "./components/data-table";
import { Checkbox } from "@/components/ui/checkbox";

const tasks = [
  {
    id: "TASK-8782",
    title:
      "You can't compress the program without quantifying the open-source SSD pixel!",
    status: "in progress",
    label: "documentation",
    priority: "medium",
  },
  {
    id: "TASK-7878",
    title:
      "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
    status: "backlog",
    label: "documentation",
    priority: "medium",
  },
  {
    id: "TASK-7839",
    title: "We need to bypass the neural TCP card!",
    status: "todo",
    label: "bug",
    priority: "high",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "backlog",
    label: "feature",
    priority: "medium",
  },
];

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
  },
  {
    accessorKey: "id",
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Task" />
    // ),
    // cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Title" />
    //   ),
    //   cell: ({ row }) => {
    //     const label = labels.find((label) => label.value === row.original.label)

    //     return (
    //       <div className="flex space-x-2">
    //         {label && <Badge variant="outline">{label.label}</Badge>}
    //         <span className="max-w-[500px] truncate font-medium">
    //           {row.getValue("title")}
    //         </span>
    //       </div>
    //     )
    //   },
    // },
    // {
    //   accessorKey: "status",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Status" />
    //   ),
    //   cell: ({ row }) => {
    //     const status = statuses.find(
    //       (status) => status.value === row.getValue("status")
    //     )

    //     if (!status) {
    //       return null
    //     }

    //     return (
    //       <div className="flex w-[100px] items-center">
    //         {status.icon && (
    //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
    //         )}
    //         <span>{status.label}</span>
    //       </div>
    //     )
    //   },
    //   filterFn: (row, id, value) => {
    //     return value.includes(row.getValue(id))
    //   },
  },
  {
    accessorKey: "priority",
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Priority" />
    // ),
    // cell: ({ row }) => {
    //   const priority = priorities.find(
    //     (priority) => priority.value === row.getValue("priority")
    //   )

    //   if (!priority) {
    //     return null
    //   }

    //   return (
    //     <div className="flex items-center">
    //       {priority.icon && (
    //         <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
    //       )}
    //       <span>{priority.label}</span>
    //     </div>
    //   )
    // },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id))
    // },
  },
  {
    id: "actions",
    // cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
export default function Home() {
  return <DataTable data={tasks} columns={columns} />;
}
