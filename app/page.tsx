"use client";

import {
  buildConfig,
  adminConfig as demoTableConfig,
} from "./context/config-context";
import { useSnapshot } from "valtio";
import { state } from "./store";
import { useMemo } from "react";
import UserInput from "./components/ui/user-input";
import { AdminRenderer } from "./components/renderer/react-admin";
import _ from "lodash";

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
    <div>
      {last && <AdminRenderer config={adminConfig} key={last?.time} />}

      <UserInput />
    </div>
  );
}
