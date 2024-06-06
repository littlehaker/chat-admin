import {
  List,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  EditButton,
  TextInput,
  Resource,
  Admin,
  BooleanField,
  BooleanInput,
} from "react-admin";
import BookIcon from "@mui/icons-material/Book";
export const PostIcon = BookIcon;
import jsonServerProvider from "ra-data-json-server";
import {
  AdminDSL,
  AdminDSLField,
  AdminDSLFieldType,
  AdminDSLResource,
} from "@/app/dsl/admin-dsl";
import { useMemo } from "react";

function renderField(field: AdminDSLField) {
  switch (field.type) {
    case AdminDSLFieldType.BOOLEAN:
      return <BooleanField source={field.name} key={field.name} />;
    case AdminDSLFieldType.TEXT:
    default:
      return <TextField source={field.name} key={field.name} />;
  }
}

function renderInput(field: AdminDSLField) {
  switch (field.type) {
    case AdminDSLFieldType.BOOLEAN:
      return <BooleanInput source={field.name} key={field.name} />;
    case AdminDSLFieldType.TEXT:
    default:
      return <TextInput source={field.name} key={field.name} />;
  }
}

export const renderList = (resource: AdminDSLResource) => () =>
  (
    <List>
      <Datagrid>
        {resource.fields.map(renderField)}
        <EditButton />
      </Datagrid>
    </List>
  );

export const renderEdit = (resource: AdminDSLResource) => () =>
  (
    <Edit>
      <SimpleForm>{resource.fields.map(renderInput)}</SimpleForm>
    </Edit>
  );

function renderResource(resource: AdminDSLResource) {
  const List = useMemo(() => renderList(resource), [resource]);
  const Edit = useMemo(() => renderEdit(resource), [resource]);
  return (
    <Resource
      key={resource.resourceName}
      name={resource.resourceName}
      list={List}
      edit={Edit}
    />
  );
}

export function AdminRenderer({ config }: { config?: AdminDSL }) {
  return (
    <Admin
      dataProvider={jsonServerProvider("https://jsonplaceholder.typicode.com")}
    >
      {config?.resources.map((resource) => renderResource(resource))}
    </Admin>
  );
}
