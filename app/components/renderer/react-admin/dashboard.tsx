"use client";

import {
  AdminDSLBarChart,
  AdminDSLBooleanField,
  AdminDSLChart,
  AdminDSLEnumField,
  AdminDSLField,
  AdminDSLPieChart,
} from "@/app/dsl/admin-dsl";
import { useCurrentConfig } from "@/app/store";
import { Card, CardContent, Typography } from "@mui/material";
import _ from "lodash";
import {
  Identifier,
  ListBase,
  ListControllerResult,
  RaRecord,
  WithListContext,
} from "react-admin";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  BarChart,
  XAxis,
  Bar,
  YAxis,
  CartesianGrid,
} from "recharts";
import CardWithIcon from "./card-with-icon";
import { renderIcon } from "./icon";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const CHART_WIDTH = 400;
const CHART_HEIGHT = 300;

function getColor(index: number) {
  return COLORS[index % COLORS.length];
}

function renderChart(
  config: AdminDSLChart,
  list: ListControllerResult<RaRecord<Identifier>>,
  field: AdminDSLField
) {
  const data = list.data;
  if (config instanceof AdminDSLPieChart) {
    const grouped = _(data)
      .groupBy(config.field)
      .mapValues((arr) => arr.length)
      .toPairs()
      .map(([name, value]) => ({ name, value }))
      .value();

    const nameFormatter = (value: any) => {
      if (field instanceof AdminDSLEnumField) {
        return (
          (field as AdminDSLEnumField).enums.find((x) => x.value === value)
            ?.label || value
        );
      }
      if (field instanceof AdminDSLBooleanField) {
        return value === "true" ? "Yes" : "No";
      }
      return value;
    };

    return (
      <PieChart width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Pie
          data={grouped}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
        >
          {grouped.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index)} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, nameFormatter(name)]} />
        <Legend formatter={nameFormatter} />
      </PieChart>
    );
  }
  if (config instanceof AdminDSLBarChart) {
    return (
      <BarChart width={CHART_WIDTH} height={CHART_HEIGHT} data={data}>
        <XAxis dataKey={config.nameField} />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Bar dataKey={config.valueField} type="monotone" fill={getColor(0)} />
      </BarChart>
    );
  }
  return null;
}

export default function Dashboard() {
  const { config } = useCurrentConfig();
  if (!config) {
    return undefined;
  }
  return (
    <div className="flex flex-col gap-2 p-2 m-2">
      {/* Resources */}
      <div className="flex flex-row gap-2">
        {config.resources.map((resource) => {
          return (
            <ListBase
              key={resource.resourceName}
              resource={resource.resourceName}
              disableSyncWithLocation
              perPage={1}
            >
              <WithListContext
                render={(listProps) => {
                  return (
                    <CardWithIcon
                      to={`/${resource.resourceName}`}
                      icon={renderIcon(resource.iconName)}
                      title={listProps.defaultTitle}
                      subtitle={listProps.total?.toString()}
                    />
                  );
                }}
              />
            </ListBase>
          );
        })}
      </div>
      <div>
        {config.resources.map((resource) => {
          const fields = resource.fields.filter(
            (x) =>
              x instanceof AdminDSLEnumField ||
              x instanceof AdminDSLBooleanField
          );
          if (fields.length === 0) {
            return null;
          }
          return (
            <div key={resource.resourceName} className="mt-5">
              <Typography variant="h4">{resource.resourceTitle}</Typography>
              <div className="flex flex-row gap-2 flex-wrap mt-2">
                {fields.map((field) => (
                  <ListBase
                    resource={resource.resourceName}
                    key={`${resource.resourceName}_${field.name}`}
                    disableSyncWithLocation
                    perPage={Infinity}
                  >
                    <WithListContext
                      render={(listProps) => {
                        if (listProps.data?.length === 0) {
                          return null;
                        }
                        return (
                          <Card>
                            <CardContent>
                              <Typography variant="h5">
                                {listProps.defaultTitle} {field.name}
                              </Typography>
                              {renderChart(
                                new AdminDSLPieChart(
                                  resource.resourceName,
                                  field.name
                                ),
                                listProps,
                                field
                              )}
                            </CardContent>
                          </Card>
                        );
                      }}
                    />
                  </ListBase>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
