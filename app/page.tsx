"use client";

import "@fontsource/roboto/300.css";

import { resetState, state, useCurrentConfig } from "./store";
import UserInput from "./_components/ui/user-input";
import { AdminRenderer } from "./_components/renderer/react-admin";
import History from "./_components/ui/history";
import { Typography } from "@mui/material";
import HintList from "./_components/ui/hint-list";
import { useEffect } from "react";
import { subscribe } from "valtio";
import AIDrawer from "./_components/ui/ai-drawer";
import APISetting from "./_components/ui/api-setting";

const lsKey = "valtioStore";

export default function Home() {
  const { config, item } = useCurrentConfig();

  useEffect(() => {
    const lsState = localStorage.getItem(lsKey);

    // sync to localStorage
    subscribe(state, () => {
      localStorage.setItem(lsKey, JSON.stringify(state));
    });

    if (!lsState) {
      return;
    }
    try {
      resetState(JSON.parse(lsState));
    } catch {}
  }, []);

  if (!item) {
    // Empty
    return (
      <div className="flex flex-col justify-center items-center h-screen g-8">
        <Typography variant="h1">Chat Admin</Typography>{" "}
        <div className="w-[500px] flex flex-col g-10">
          <UserInput />
          <HintList />
        </div>
        <APISetting />
        <iframe
          width="170"
          height="30"
          className="mt-10"
          title="GitHub"
          src="https://ghbtns.com/github-btn.html?user=littlehaker&repo=chat-admin&type=star&size=large"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex-1">
        {item && <AdminRenderer config={config} key={item?.time} />}
      </div>
      <AIDrawer />
    </div>
  );
}
