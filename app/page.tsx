"use client";

import { buildConfig } from "./context/config-context";
import { useSnapshot } from "valtio";
import { state, useCurrentConfig } from "./store";
import { useMemo } from "react";
import UserInput from "./components/ui/user-input";
import { AdminRenderer } from "./components/renderer/react-admin";
import _ from "lodash";
import History from "./components/ui/history";

export default function Home() {
  const { config, item } = useCurrentConfig();
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex-1">
        {item && <AdminRenderer config={config} key={item?.time} />}
      </div>
      <div className="flex flex-col">
        <div className="h-[50px]"></div>
        <div className="flex-1 overflow-y-auto">
          <History />
        </div>
        <UserInput />
      </div>
    </div>
  );
}
