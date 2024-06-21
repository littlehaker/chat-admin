import { Stack } from "@mui/material";
import { FC } from "react";
import { Layout as RALayout } from "react-admin";
import { AppBar } from "./appbar";

type Props = {
  children?: React.ReactNode;
};

export const Layout: FC<Props> = ({ children }) => (
  <RALayout appBar={AppBar}>{children}</RALayout>
);
