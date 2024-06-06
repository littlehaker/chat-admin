import { state, changeInput, send } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSnapshot } from "valtio";

export default function UserInput() {
  const snap = useSnapshot(state);
  return (
    <div className="flex gap-2">
      <Input value={snap.input} onChange={(e) => changeInput(e.target.value)} />
      <Button onClick={send} disabled={snap.submitting}>
        Send
      </Button>
    </div>
  );
}
