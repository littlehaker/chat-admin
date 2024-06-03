import { createContext } from "react";
import { admin } from "../dsl/admin-dsl";

export const tableConfig = admin((t) => {
  t.pagination([2, 10, 20]);

  t.field("id");
  t.field("title", { filterable: true });
  t.enumField(
    "priority",
    [
      { label: "High", value: "high" },
      { label: "Medium", value: "medium", variant: "secondary" },
    ],
    { filterable: true }
  );

  t.rowAction("Edit");
  t.rowAction("Delete", { confirmText: "Want to delete?" }, (row) => {
    console.log("Deleting row:", row);
  });

  t.bulkAction("Delete");
  t.bulkAction("Download");
});

export const ConfigContext = createContext(tableConfig);
