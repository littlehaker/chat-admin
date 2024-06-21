import { Divider, Drawer, IconButton, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UserInput from "./user-input";
import History from "./history";
import { useSnapshot } from "valtio";
import { close, state } from "@/app/store";

export default function AIDrawer() {
  const snap = useSnapshot(state);
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
