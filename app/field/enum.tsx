import _ from "lodash";
import { FieldMeta } from "./base";
import { Badge } from "@/components/ui/badge";

export class EnumField extends FieldMeta {
  render(config, value, row) {
    const enumItem = config.enums.find((x) => x.value === value);

    const display = enumItem?.label || _.capitalize(value);
    return <Badge variant={enumItem?.variant || "default"}>{display}</Badge>;
  }
}
