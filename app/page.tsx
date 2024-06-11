"use client";

import { useCurrentConfig } from "./store";
import UserInput from "./components/ui/user-input";
import { AdminRenderer } from "./components/renderer/react-admin";
import History from "./components/ui/history";
import { Typography } from "@mui/material";
export default function Home() {
  const { config, item } = useCurrentConfig();
  if (!item) {
    // Empty
    return (
      <div className="flex flex-col justify-center items-center h-screen g-8">
        <Typography variant="h1">Chat Admin</Typography>{" "}
        <div className="w-[500px]">
          <UserInput />
        </div>
        <iframe
          width="170"
          height="30"
          className="mt-12"
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
