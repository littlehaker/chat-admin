import {
  AdminDSLEnumItem,
  AdminDSLField,
  AdminDSLFieldType,
  AdminDSLEnumField,
} from "@/app/dsl/admin-dsl";
import {
  NumberField,
  SelectField,
  BooleanField,
  TextField,
  NumberInput,
  SelectInput,
  BooleanInput,
  TextInput,
  DateField,
  DateInput,
} from "react-admin";

function getChoices(enums: AdminDSLEnumItem[]) {
  return enums.map((item) => ({ id: item.value, name: item.label }));
}

export function renderField(field: AdminDSLField) {
  switch (field.type) {
    case AdminDSLFieldType.NUMBER:
      return <NumberField source={field.name} key={field.name} />;
    case AdminDSLFieldType.DATE:
      return <DateField source={field.name} key={field.name} />;
    case AdminDSLFieldType.ENUM:
      return (
        <SelectField
          source={field.name}
          key={field.name}
          choices={getChoices((field as AdminDSLEnumField).enums)}
        />
      );
    case AdminDSLFieldType.BOOLEAN:
      return <BooleanField source={field.name} key={field.name} />;
    case AdminDSLFieldType.TEXT:
    default:
      return <TextField source={field.name} key={field.name} />;
  }
}

export function renderInput(field: AdminDSLField) {
  switch (field.type) {
    case AdminDSLFieldType.NUMBER:
      return <NumberInput source={field.name} key={field.name} />;
    case AdminDSLFieldType.DATE:
      return <DateInput source={field.name} key={field.name} />;
    case AdminDSLFieldType.ENUM:
      return (
        <SelectInput
          source={field.name}
          key={field.name}
          choices={getChoices((field as AdminDSLEnumField).enums)}
        />
      );
    case AdminDSLFieldType.BOOLEAN:
      return <BooleanInput source={field.name} key={field.name} />;
    case AdminDSLFieldType.TEXT:
    default:
      return <TextInput source={field.name} key={field.name} />;
  }
}
