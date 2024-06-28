"use client";

import {
  state,
  changeInput,
  send,
  useCurrentConfig,
  sendPrompt,
} from "@/app/store";
import {
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip,
} from "@mui/material";
import { useSnapshot } from "valtio";
import SendIcon from "@mui/icons-material/Send";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { MouseEventHandler, useState } from "react";

export default function UserInput() {
  const snap = useSnapshot(state, { sync: true });
  const disabled = snap.submitting || !snap.input;

  const { advices } = useCurrentConfig();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <form
      className="flex gap-2 p-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (disabled) {
          return;
        }
        send();
      }}
    >
      {advices && advices.length > 0 && (
        <>
          <Tooltip title="Need some ideas?">
            <IconButton aria-describedby={id} onClick={handleClick}>
              <TipsAndUpdatesIcon />
            </IconButton>
          </Tooltip>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <List>
              {advices.map((advice) => (
                <ListItem disablePadding key={advice}>
                  <ListItemButton
                    onClick={() => {
                      sendPrompt(advice);
                      handleClose();
                    }}
                  >
                    <ListItemText>{advice}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Popover>
        </>
      )}

      <Input
        className="flex-1"
        placeholder="Describe the admin app you desire"
        value={snap.input}
        onChange={(e) => changeInput(e.target.value)}
      />
      <IconButton
        aria-label="Send"
        color="primary"
        onClick={send}
        disabled={disabled}
      >
        <SendIcon />
      </IconButton>
    </form>
  );
}
