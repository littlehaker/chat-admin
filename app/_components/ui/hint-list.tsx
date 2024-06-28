import { changeInput } from "@/app/store";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const hints = [
  "Contacts with id, name, birthday, gender",
  "Albums with musicians",
  "I want to manage todos that can be assigned to user",
];

export default function HintList() {
  return (
    <List>
      <ListItem>
        <ListItemText>Need some ideas?</ListItemText>
      </ListItem>
      <Divider />
      {hints.map((hint) => (
        <ListItem disablePadding key={hint}>
          <ListItemButton
            onClick={() => {
              changeInput(hint);
            }}
          >
            <ListItemText>{hint}</ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem>
        <ListItemText>...</ListItemText>
      </ListItem>
    </List>
  );
}
