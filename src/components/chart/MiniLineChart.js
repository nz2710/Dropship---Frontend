import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const MiniLineChart = ({ data}) => {
  return (
    <ResponsiveContainer width="100%" height={75}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" hide />
        <YAxis hide />
        {/* <Tooltip /> */}
        <Area
          type="monotone"
          dataKey="value"
          stroke="#22C55E"
          fill="url(#color1)"
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MiniLineChart;
