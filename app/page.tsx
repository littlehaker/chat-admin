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

export default function Home() {
  const snap = useSnapshot(state);
  const adminConfig = useMemo(() => {
    if (!snap.history[0]) {
      return undefined;
    } else {
      return buildConfig(snap.history[0].content);
    }
  }, [snap.history[0]]);
  return (
    <div>
      {adminConfig && <AdminRenderer config={adminConfig} />}

      <UserInput />
    </div>
  );
}
