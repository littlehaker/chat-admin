import { FC } from "react";
import { Layout as RALayout } from "react-admin";
import { AppBar } from "./appbar";
import Dashboard from "./dashboard";

type Props = {
  children?: React.ReactNode;
  dashboard?: React.ReactNode;
};

export const Layout: FC<Props> = ({ children, dashboard }) => (
  <RALayout dashboard={Dashboard} appBar={AppBar}>
    {children}
  </RALayout>
);
