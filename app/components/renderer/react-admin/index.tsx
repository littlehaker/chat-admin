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
import { renderField, FilterSidebar, renderInput } from "./fields";
import Dashboard from "./dashboard";
import { Layout } from "./layout";

export const renderList = (resource: AdminDSLResource) =>
  function ResourceList() {
    return (
      <List
        aside={<FilterSidebar resource={resource} />}
        pagination={
          <Pagination rowsPerPageOptions={resource.paginationSizes} />
        }
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
  };

export const renderEdit = (resource: AdminDSLResource) =>
  function ResourceEdit() {
    return (
      <Edit redirect="list">
        <SimpleForm>{resource.fields.map(renderInput)}</SimpleForm>
      </Edit>
    );
  };

export const renderCreate = (resource: AdminDSLResource) =>
  function ResourceCreate() {
    return (
      <Create redirect="list">
        <SimpleForm>{resource.fields.map(renderInput)}</SimpleForm>
      </Create>
    );
  };

const renderShow = (resource: AdminDSLResource) =>
  function ResourceShow() {
    return (
      <Show>
        <SimpleShowLayout>{resource.fields.map(renderField)}</SimpleShowLayout>
      </Show>
    );
  };

function renderResource(resource: AdminDSLResource) {
  const ResourceList = renderList(resource);
  const ResourceEdit = renderEdit(resource);
  const ResourceCreate = renderCreate(resource);
  const ResourceShow = renderShow(resource);
  return (
    <Resource
      key={resource.resourceName}
      name={resource.resourceName}
      list={ResourceList}
      edit={ResourceEdit}
      create={ResourceCreate}
      show={ResourceShow}
      recordRepresentation={resource.renderTitle}
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
    <Admin dashboard={Dashboard} dataProvider={dataProvider} layout={Layout}>
      {config?.resources.map((resource) => renderResource(resource))}
    </Admin>
  );
}
