import * as React from "react";
import { AppBar as RAAppBar, TitlePortal } from "react-admin";
import Box from "@mui/material/Box";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { IconButton, Tooltip } from "@mui/material";
import { open } from "@/app/store";

export const AppBar = () => (
  <RAAppBar color="primary">
    <TitlePortal />
    <Box flex="1" />
    <Tooltip title="Open AI panel">
      <IconButton onClick={open} sx={{ color: "white" }}>
        <AutoAwesomeIcon />
      </IconButton>
    </Tooltip>
  </RAAppBar>
);
