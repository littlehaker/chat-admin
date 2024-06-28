import {
  AdminDSLEnumItem,
  AdminDSLField,
  AdminDSLFieldType,
  AdminDSLEnumField,
  AdminDSLResource,
  AdminDSLReferenceField,
} from "@/app/_dsl/admin-dsl";
import { Card, CardContent } from "@mui/material";
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
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  SavedQueriesList,
  ReferenceInput,
  ReferenceField,
  SearchInput,
  Labeled,
  RichTextField,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import SearchIcon from "@mui/icons-material/Search";
import { useMemo } from "react";
import { IconName, renderIcon } from "./icon";

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
    case AdminDSLFieldType.REFERENCE:
      return (
        <ReferenceField
          reference={(field as AdminDSLReferenceField).reference}
          source={field.name}
          key={field.name}
          link="show"
        />
      );
    case AdminDSLFieldType.BOOLEAN:
      return <BooleanField source={field.name} key={field.name} />;
    case AdminDSLFieldType.RICH_TEXT:
      return <RichTextField source={field.name} key={field.name} />;
    case AdminDSLFieldType.TEXT:
    default:
      return <TextField source={field.name} key={field.name} />;
  }
}

export function renderInput(field: AdminDSLField) {
  const disabled = field.options.editable === false;
  if (disabled) {
    return <Labeled>{renderField(field)}</Labeled>;
  }

  const props = {
    source: field.name,
    key: field.name,
  };
  switch (field.type) {
    case AdminDSLFieldType.NUMBER:
      return <NumberInput {...props} />;
    case AdminDSLFieldType.DATE:
      return <DateInput {...props} />;
    case AdminDSLFieldType.ENUM:
      return (
        <SelectInput
          {...props}
          choices={getChoices((field as AdminDSLEnumField).enums)}
        />
      );
    case AdminDSLFieldType.REFERENCE:
      return (
        <ReferenceInput
          {...props}
          reference={(field as AdminDSLReferenceField).reference}
        />
      );
    case AdminDSLFieldType.BOOLEAN:
      return <BooleanInput {...props} />;
    case AdminDSLFieldType.RICH_TEXT:
      return <RichTextInput {...props} />;
    case AdminDSLFieldType.TEXT:
    default:
      return <TextInput {...props} />;
  }
}

export function renderFilter(field: AdminDSLField) {
  switch (field.type) {
    case AdminDSLFieldType.TEXT:
    default:
      return <TextInput source={field.name} key={field.name} />;
  }
}

export function renderFilters(resource: AdminDSLResource) {
  return [
    <SearchInput source="q" alwaysOn key="q" />,
    ...resource.fields
      .filter((x) => x.options?.filterable === true)
      .map(renderInput),
  ];
}

function renderFieldIcon(field: AdminDSLField) {
  let icon = <SearchIcon fontSize="small" />;
  if (field.options.icon) {
    const Comp = renderIcon(field.options.icon as IconName);
    if (Comp) {
      icon = <Comp fontSize="small" />;
    }
  }
  return icon;
}

export const FilterSidebar = ({ resource }: { resource: AdminDSLResource }) => {
  const filterableFields = useMemo(
    () => resource.fields.filter((x) => x.options?.filterable === true),
    [resource]
  );
  return (
    <Card sx={{ order: -1, mt: 6, mr: 1, width: 220 }}>
      <CardContent>
        <SavedQueriesList />
        <FilterLiveSearch />

        {(
          filterableFields.filter(
            (x) => x.type === AdminDSLFieldType.ENUM
          ) as AdminDSLEnumField[]
        ).map((x) => {
          return (
            <FilterList key={x.name} label={x.name} icon={renderFieldIcon(x)}>
              {x.enums.map((item) => (
                <FilterListItem
                  label={item.label}
                  value={{ [x.name]: item.value }}
                  key={item.value}
                />
              ))}
            </FilterList>
          );
        })}

        {filterableFields
          .filter((x) => x.type === AdminDSLFieldType.BOOLEAN)
          .map((x) => (
            <FilterList key={x.name} label={x.name} icon={renderFieldIcon(x)}>
              <FilterListItem label="Yes" value={{ [x.name]: true }} />
              <FilterListItem label="No" value={{ [x.name]: false }} />
            </FilterList>
          ))}
      </CardContent>
    </Card>
  );
};
