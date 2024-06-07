import {
  List,
  Datagrid,
  Edit,
  SimpleForm,
  EditButton,
  Resource,
  Admin,
  Create,
  BulkExportButton,
  BulkDeleteButton,
  ShowButton,
  Show,
  SimpleShowLayout,
  Pagination,
} from "react-admin";
import BookIcon from "@mui/icons-material/Book";
export const PostIcon = BookIcon;
import localStorageDataProvider from "ra-data-local-storage";

import { AdminDSL, AdminDSLResource } from "@/app/dsl/admin-dsl";
import { Fragment, useMemo } from "react";
import { IconName, renderIcon } from "./icon";
import { renderField, renderInput } from "./fields";

export const renderList = (resource: AdminDSLResource) => () =>
  (
    <List
      pagination={<Pagination rowsPerPageOptions={resource.paginationSizes} />}
    >
      <Datagrid
        bulkActionButtons={
          <Fragment>
            <BulkExportButton />
            <BulkDeleteButton />
          </Fragment>
        }
      >
        {resource.fields.map(renderField)}
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );

export const renderEdit = (resource: AdminDSLResource) => () =>
  (
    <Edit>
      <SimpleForm>{resource.fields.map(renderInput)}</SimpleForm>
    </Edit>
  );

export const renderCreate = (resource: AdminDSLResource) => () =>
  (
    <Create>
      <SimpleForm>{resource.fields.map(renderInput)}</SimpleForm>
    </Create>
  );

const renderShow = (resource: AdminDSLResource) => () =>
  (
    <Show>
      <SimpleShowLayout>{resource.fields.map(renderField)}</SimpleShowLayout>
    </Show>
  );

function renderResource(resource: AdminDSLResource) {
  const ResourceList = useMemo(() => renderList(resource), [resource]);
  const ResourceEdit = useMemo(() => renderEdit(resource), [resource]);
  const ResourceCreate = useMemo(() => renderCreate(resource), [resource]);
  const ResourceShow = useMemo(() => renderShow(resource), [resource]);
  return (
    <Resource
      key={resource.resourceName}
      name={resource.resourceName}
      list={ResourceList}
      edit={ResourceEdit}
      create={ResourceCreate}
      show={ResourceShow}
      icon={
        resource.iconName
          ? renderIcon(resource.iconName as IconName)
          : undefined
      }
    />
  );
}

export function AdminRenderer({ config }: { config?: AdminDSL }) {
  const dataProvider = useMemo(() => localStorageDataProvider(), [config]);
  return (
    <Admin dataProvider={dataProvider}>
      {config?.resources.map((resource) => renderResource(resource))}
    </Admin>
  );
}
