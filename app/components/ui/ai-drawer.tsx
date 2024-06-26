import { Divider, Drawer, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import UserInput from "./user-input";
import History from "./history";
import { useSnapshot } from "valtio";
import { open, close, openAPISetting, state } from "@/app/store";
import APISetting from "./api-setting";
import { useEffect } from "react";

export default function AIDrawer() {
  const snap = useSnapshot(state);
  useEffect(() => {
    open();
  }, []);

  return (
    <Drawer
      variant="persistent"
      open={snap.visible}
      anchor="right"
      onClose={close}
      className="flex flex-col"
    >
      <div className="flex items-center">
        <IconButton onClick={close}>
          <ChevronRightIcon />
        </IconButton>
        <div className="flex-1"></div>
        <IconButton onClick={openAPISetting}>
          <SettingsIcon />
        </IconButton>
        <APISetting />
      </div>
      <Divider />
      <div className="flex-1 overflow-y-auto">
        <History />
      </div>
      <Divider />
      <div className="px-2">
        <UserInput />
      </div>
    </Drawer>
  );
}
