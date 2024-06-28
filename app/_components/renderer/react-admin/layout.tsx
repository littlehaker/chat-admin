import { LayoutComponent, Layout as RALayout } from "react-admin";
import { AppBar } from "./appbar";

export const Layout: LayoutComponent = ({ children, dashboard }) => (
  <RALayout dashboard={dashboard} appBar={AppBar}>
    {children}
  </RALayout>
);
