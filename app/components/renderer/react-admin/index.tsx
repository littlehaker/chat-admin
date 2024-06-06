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
} from "react-admin";
import BookIcon from "@mui/icons-material/Book";
export const PostIcon = BookIcon;
import jsonServerProvider from "ra-data-json-server";
import { AdminDSLField, AdminDSLFieldType } from "@/app/dsl/admin-dsl";
import { useMemo } from "react";

function renderField(field: AdminDSLField) {
  switch (field.type) {
    case AdminDSLFieldType.TEXT:
    default:
      return <TextField source={field.name} key={field.name} />;
  }
}

function renderInput(field: AdminDSLField) {
  switch (field.type) {
    case AdminDSLFieldType.TEXT:
    default:
      return <TextInput source={field.name} key={field.name} />;
  }
}

export const renderList = (resource) => () =>
  (
    <List>
      <Datagrid>
        {resource.fields.map(renderField)}
        <EditButton />
      </Datagrid>
    </List>
  );

// const PostTitle = () => {
//   const record = useRecordContext();
//   return <span>Post {record ? `"${record.title}"` : ""}</span>;
// };

export const renderEdit = (resource) => () =>
  (
    <Edit>
      <SimpleForm>{resource.fields.map(renderInput)}</SimpleForm>
    </Edit>
  );

// export const PostCreate = () => (
//   <Create title="Create a Post">
//     <SimpleForm>
//       <TextInput source="title" />
//       <TextInput source="teaser" options={{ multiline: true }} />
//       <TextInput multiline source="body" />
//       <TextInput label="Publication date" source="published_at" />
//       <TextInput source="average_note" />
//     </SimpleForm>
//   </Create>
// );

function renderResource({ resource }) {
  const List = useMemo(() => renderList(resource), [resource]);
  const Edit = useMemo(() => renderEdit(resource), [resource]);
  return <Resource name={resource.resourceName} list={List} edit={Edit} />;
}

export function AdminRenderer({ config }: any) {
  // console.log(config);
  return (
    <Admin
      dataProvider={jsonServerProvider("https://jsonplaceholder.typicode.com")}
    >
      {config.resources.map((resource) => renderResource({ resource }))}
    </Admin>
  );
}
