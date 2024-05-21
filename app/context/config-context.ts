import { createContext } from "react";
import { admin } from "../dsl/admin-dsl";

export const tableConfig = admin((t) => {
  t.pagination([2, 10, 20]);

  t.field("ID");
  t.field("name", { label: "名称", filterable: true });
  t.enumField("status", [{ label: "是", value: true, color: "green" }], {
    label: "状态",
  });

  t.rowAction("Edit");
  t.rowAction("Delete", { confirmText: "真的要删除吗" }, (row) => {
    console.log("Deleting row:", row);
  });

  t.bulkAction("批量删除");
});

export const ConfigContext = createContext(tableConfig);
