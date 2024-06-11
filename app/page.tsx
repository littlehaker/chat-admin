"use client";

import "@fontsource/roboto/300.css";

import { useCurrentConfig } from "./store";
import UserInput from "./components/ui/user-input";
import { AdminRenderer } from "./components/renderer/react-admin";
import History from "./components/ui/history";
import { Typography } from "@mui/material";
import HintList from "./components/ui/hint-list";
export default function Home() {
  const { config, item } = useCurrentConfig();
  if (!item) {
    // Empty
    return (
      <div className="flex flex-col justify-center items-center h-screen g-8">
        <Typography variant="h1">Chat Admin</Typography>{" "}
        <div className="w-[500px] flex flex-col g-10">
          <UserInput />
          <HintList />
        </div>
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
