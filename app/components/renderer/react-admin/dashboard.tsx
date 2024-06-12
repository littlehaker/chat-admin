"use client";

import { AdminDSLPieChart } from "@/app/dsl/admin-dsl";
import { useCurrentConfig } from "@/app/store";
import { Card, CardContent, Typography } from "@mui/material";
import _ from "lodash";
import { ListBase, WithListContext } from "react-admin";
import { PieChart, Pie, Text, Tooltip, Legend, Cell } from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const { config } = useCurrentConfig();
  if (!config?.dashboardConfig) {
    return undefined;
  }
  return (
    <div className="flex flex-row flex-wrap gap-2 p-2 m-2">
      {config.dashboardConfig.charts.map((_chartConfig) => {
        const chartConfig = _chartConfig as AdminDSLPieChart;
        return (
          <Card>
            <CardContent>
              <Typography variant="h5">
                {chartConfig.resource} {chartConfig.field}
              </Typography>
              <ListBase
                resource={chartConfig.resource}
                disableSyncWithLocation
                perPage={100}
              >
                <WithListContext
                  render={({ data }) => {
                    const grouped = _(data)
                      .groupBy(chartConfig.field)
                      .mapValues((arr) => arr.length)
                      .toPairs()
                      .map(([name, value]) => ({ name, value }))
                      .value();
                    return (
                      <PieChart width={400} height={300}>
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
                          <Text>aaaa</Text>
                          {grouped.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    );
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
