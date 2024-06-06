import { state, changeInput, send } from "@/app/store";
import { Button, Input } from "@mui/material";
import { useSnapshot } from "valtio";

export default function UserInput() {
  const snap = useSnapshot(state, { sync: true });

  return (
    <div className="flex gap-2 h-[50px]">
      <Input value={snap.input} onChange={(e) => changeInput(e.target.value)} />
      <Button onClick={send} disabled={snap.submitting}>
        Send
      </Button>
    </div>
  );
}
