import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomLineChart = ({ data, filterType }) => {
  const formatXAxis = (tickItem) => {
    if (filterType === "year") {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return months[tickItem - 1];
    } else {
      return tickItem; // Assuming the date is already in the correct format
    }
  };

  const formatYAxis = (value) => {
    const billion = 1000000000;
    const million = 1000000;
    const thousand = 1000;
    if (value >= billion) {
      return `${(value / billion).toFixed(1)}B`;
    } else if (value >= million) {
      return `${(value / million).toFixed(1)}M`;
    } else if (value >= thousand) {
      return `${(value / thousand).toFixed(1)}K`;
    } else {
      return value.toString();
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey={filterType === "year" ? "month" : "date"} 
          tickFormatter={formatXAxis}
          stroke="#6B7280"
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis
          tickFormatter={formatYAxis}
          stroke="#6B7280"
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }}
          formatter={(value) => new Intl.NumberFormat('en-US').format(value)}
        />
        <Legend iconType="circle" />
        <Line type="monotone" dataKey="labor_cost" stroke="#F59E0B" strokeWidth={2} dot={false} name="Labor Cost" />
        <Line type="monotone" dataKey="moving_cost" stroke="#10B981" strokeWidth={2} dot={false} name="Moving Cost" />
        <Line type="monotone" dataKey="total_cost" stroke="#3B82F6" strokeWidth={2} dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Total Cost" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;