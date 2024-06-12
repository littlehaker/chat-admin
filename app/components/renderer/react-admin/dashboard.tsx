"use client";

import {
  AdminDSLBarChart,
  AdminDSLChart,
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const CHART_WIDTH = 400;
const CHART_HEIGHT = 300;

function getColor(index: number) {
  return COLORS[index % COLORS.length];
}

function renderChart(
  config: AdminDSLChart,
  list: ListControllerResult<RaRecord<Identifier>>
) {
  const data = list.data;
  if (config instanceof AdminDSLPieChart) {
    const grouped = _(data)
      .groupBy(config.field)
      .mapValues((arr) => arr.length)
      .toPairs()
      .map(([name, value]) => ({ name, value }))
      .value();

    return (
      <>
        <Typography variant="h5">
          {list.defaultTitle} {config.field}
        </Typography>
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
          <Tooltip />
          <Legend />
        </PieChart>
      </>
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
  if (!config?.dashboardConfig) {
    return undefined;
  }
  return (
    <div className="flex flex-row flex-wrap gap-2 p-2 m-2">
      {config.dashboardConfig.charts.map((chartConfig) => {
        return (
          <Card>
            <CardContent>
              <ListBase
                resource={chartConfig.resource}
                disableSyncWithLocation
                perPage={100}
              >
                <WithListContext
                  render={(listProps) => {
                    return renderChart(chartConfig, listProps);
                  }}
                />
              </ListBase>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
