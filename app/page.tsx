"use client";

import { buildConfig } from "./context/config-context";
import { useSnapshot } from "valtio";
import { state } from "./store";
import { useMemo } from "react";
import UserInput from "./components/ui/user-input";
import { AdminRenderer } from "./components/renderer/react-admin";
import _ from "lodash";
import History from "./components/ui/history";

export default function Home() {
  const snap = useSnapshot(state);
  const last = _.last(snap.history);

  const adminConfig = useMemo(() => {
    const last = _.last(snap.history);
    if (!last) {
      return undefined;
    } else {
      return buildConfig(last.content);
    }
  }, [_.last(snap.history)]);
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex-1">
        {last && <AdminRenderer config={adminConfig} key={last?.time} />}
      </div>
      <div className="flex flex-col">
        <div className="h-[50px]"></div>
        <div className="flex-1">
          <History />
        </div>
        <UserInput />
      </div>
    </div>
  );
}
