import * as MUIcon from "@mui/icons-material";

export type IconName = keyof typeof MUIcon;
export function renderIcon(icon?: string) {
  if (!icon) {
    return undefined;
  }
  const comp = MUIcon[icon as IconName];
  return comp;
}
