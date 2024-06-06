"use client";
import { createContext } from "react";
import { admin } from "../dsl/admin-dsl";

export function buildConfig(code: string) {
  const fn = new Function("admin", `return ${code.replace(/^[\n]+/, "")}`);
  return fn(admin);
}

export const adminConfig = buildConfig(`
admin((a) => {
  a.resource("posts", (t) => {
    t.pagination([2, 10, 20]);

    t.field("id");
    t.field("title", { filterable: true });
    t.field("body");
    t.numberField("score");
    t.booleanField("completed", { label: "Completed", editable: false });
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
});
`);

export const ConfigContext = createContext(adminConfig);
