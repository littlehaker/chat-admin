import {
  closeAPISetting,
  inputAPIEndpoint,
  inputAPIKey,
  openAPISetting,
  state,
} from "@/app/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

export default function APISetting() {
  const snap = useSnapshot(state, { sync: true });
  const apiAvailable = !!snap.api.endpoint && !!snap.api.key;
  useEffect(() => {
    if (!apiAvailable) {
      openAPISetting();
    }
  }, [apiAvailable]);

  return (
    <Dialog open={snap.api.visible} onClose={closeAPISetting}>
      <DialogTitle>Config OpenAI API Key</DialogTitle>
      <DialogContent>
        <div className="w-[500px] flex flex-col gap-2">
          <TextField
            value={snap.api.endpoint}
            onChange={inputAPIEndpoint}
            label="Endpoint"
            variant="standard"
          />
          <TextField
            value={snap.api.key}
            onChange={inputAPIKey}
            label="API Key"
            variant="standard"
            autoFocus
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button disabled={!apiAvailable} onClick={closeAPISetting}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
