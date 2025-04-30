"use client";

import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Label, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartData = [
  { browser: "Girls", visitors: 275, fill: "#4285F4" },
  { browser: "Boys", visitors: 200, fill: "#FFB300" },
  { browser: "Firefox", visitors: 287, fill: "#FF5722" },
  { browser: "Edge", visitors: 173, fill: "#00A4EF" },
  { browser: "Other", visitors: 190, fill: "#9E9E9E" },
];

// ✅ Named export here
export function PieChart() {
  const totalVisitors = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col max-w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px]">
          <RechartsPieChart width={250} height={250}>
            <Tooltip />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              stroke="white"
              strokeWidth={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox) return null;
                  const { cx, cy } = viewBox;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan x={cx} y={cy} className="fill-black text-xl font-bold">
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan x={cx} y={cy + 20} className="fill-gray-500 text-sm">
                        Students
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </RechartsPieChart>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-500">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
