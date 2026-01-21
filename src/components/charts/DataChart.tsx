"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  value2?: number;
  [key: string]: string | number | undefined;
}

interface ChartProps {
  data: DataPoint[];
  type: "area" | "bar" | "pie";
  colors?: string[];
  height?: number;
  showGrid?: boolean;
}

const defaultColors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-slate-500 text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-slate-800 font-semibold">
            <span style={{ color: entry.color }}>{entry.name}: </span>
            {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DataChart({
  data,
  type,
  colors = defaultColors,
  height = 300,
  showGrid = true,
}: ChartProps) {
  if (type === "area") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          )}
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value >= 1000 ? `${value / 1000}k` : value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[1]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors[1]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            name="Primary"
          />
          {data[0]?.value2 !== undefined && (
            <Area
              type="monotone"
              dataKey="value2"
              stroke={colors[1]}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue2)"
              name="Secondary"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          )}
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill={colors[0]}
            radius={[4, 4, 0, 0]}
            name="Value"
          />
          {data[0]?.value2 !== undefined && (
            <Bar
              dataKey="value2"
              fill={colors[1]}
              radius={[4, 4, 0, 0]}
              name="Secondary"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
