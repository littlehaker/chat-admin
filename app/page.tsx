"use client";

import { Input } from "@/components/ui/input";
import { DataTable } from "./components/renderer/data-table";
import {
  ConfigContext,
  buildConfig,
  tableConfig as demoTableConfig,
} from "./context/config-context";
import { useSnapshot } from "valtio";
import { changeInput, send, state } from "./store";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const data: any[] = [
  /*
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
  */
];
function UserInput() {
  const snap = useSnapshot(state);
  return (
    <div className="flex gap-2">
      <Input value={snap.input} onChange={(e) => changeInput(e.target.value)} />
      <Button onClick={send} disabled={snap.submitting}>
        Send
      </Button>
    </div>
  );
}
export default function Home() {
  const snap = useSnapshot(state);
  const tableConfig = useMemo(() => {
    if (!snap.history[0]) {
      return demoTableConfig;
    } else {
      return buildConfig(snap.history[0].content);
    }
  }, [snap.history[0]]);
  return (
    <div>
      <ConfigContext.Provider value={tableConfig}>
        <DataTable data={data} />
      </ConfigContext.Provider>
      <UserInput />
    </div>
  );
}
