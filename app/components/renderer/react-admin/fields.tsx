import {
  AdminDSLEnumItem,
  AdminDSLField,
  AdminDSLFieldType,
  AdminDSLEnumField,
  AdminDSLResource,
} from "@/app/dsl/admin-dsl";
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
} from "react-admin";
import SearchIcon from "@mui/icons-material/Search";
import { useMemo } from "react";

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

export function renderFilter(field: AdminDSLField) {
  switch (field.type) {
    case AdminDSLFieldType.TEXT:
    default:
      return <TextInput source={field.name} key={field.name} />;
  }
}

export function renderFilters(resource: AdminDSLResource) {
  return resource.fields
    .filter((x) => x.options?.filterable === true)
    .map(renderFilter);
}

export const renderFilterSidebar = (resource: AdminDSLResource) => {
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
        ).map((x) => (
          <FilterList key={x.name} label={x.name} icon={<SearchIcon />}>
            {x.enums.map((item) => (
              <FilterListItem
                label={item.label}
                value={{ [x.name]: item.value }}
                key={item.value}
              />
            ))}
          </FilterList>
        ))}

        {filterableFields
          .filter((x) => x.type === AdminDSLFieldType.BOOLEAN)
          .map((x) => (
            <FilterList key={x.name} label={x.name} icon={<SearchIcon />}>
              <FilterListItem label="Yes" value={{ [x.name]: true }} />
              <FilterListItem label="No" value={{ [x.name]: false }} />
            </FilterList>
          ))}
      </CardContent>
    </Card>
  );
};
