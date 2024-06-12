"use client";

import { state, changeInput, send } from "@/app/store";
import { IconButton, Input } from "@mui/material";
import { useSnapshot } from "valtio";
import SendIcon from "@mui/icons-material/Send";

export default function UserInput() {
  const snap = useSnapshot(state, { sync: true });
  const disabled = snap.submitting || !snap.input;

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
