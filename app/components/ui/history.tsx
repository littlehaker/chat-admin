import { selectHistoryItem, state } from "@/app/store";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

import { useSnapshot } from "valtio";
import dayjs from "dayjs";
import _ from "lodash";
export default function History() {
  const snap = useSnapshot(state);
  return (
    <div className="w-[300px]">
      <List>
        {_.sortBy(snap.history, (x) => -x.time).map((item) => (
          <ListItem key={item.time} disablePadding>
            <ListItemButton
              selected={item.time === snap.currentHistoryItem}
              onClick={() => {
                if (!item.isError) {
                  selectHistoryItem(item.time);
                }
              }}
            >
              <ListItemText
                primary={item.userPrompt}
                secondary={dayjs(item.time).format("HH:mm:ss")}
                primaryTypographyProps={
                  item.isError
                    ? {
                        color: "error",
                      }
                    : {}
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
