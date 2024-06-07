import * as MUIcon from "@mui/icons-material";

export type IconName = keyof typeof MUIcon;
export function renderIcon(icon: IconName) {
  return MUIcon[icon as IconName];
}
