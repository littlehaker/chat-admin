import {
  closeAPISetting,
  inputAPIEndpoint,
  inputAPIKey,
  inputMaxToken,
  inputModel,
  inputTemperature,
  openAPISetting,
  state,
} from "@/app/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

const modelList = ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-4o"].map(
  (x) => ({ value: x, label: x })
);

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
            onChange={(e) => inputAPIEndpoint(e.target.value)}
            label="Endpoint"
            variant="standard"
          />
          <TextField
            value={snap.api.key}
            onChange={(e) => inputAPIKey(e.target.value)}
            label="API Key"
            variant="standard"
            autoFocus
          />

          <TextField
            select
            label="Model"
            variant="standard"
            value={snap.api.model}
            onChange={(e) => inputModel(e.target.value)}
          >
            {modelList.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Max Token"
            variant="standard"
            type="number"
            value={snap.api.maxToken}
            onChange={(e) => inputMaxToken(Number(e.target.value))}
          />

          <TextField
            label="Temperature"
            variant="standard"
            type="number"
            value={snap.api.temperature}
            onChange={(e) => inputTemperature(Number(e.target.value))}
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
