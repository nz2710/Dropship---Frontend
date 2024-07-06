import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AreaChartComponent = ({ data, filterType, dataKeys }) => {
  const formatXAxis = (tickItem) => {
    if (filterType === "year") {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return months[tickItem - 1];
    } else {
      return tickItem;
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

  const keys = Array.isArray(dataKeys) ? dataKeys : [dataKeys];

  const maxValue = Math.max(...data.flatMap(item => 
    keys.map(key => parseFloat(item[key]) || 0)
  ));

  const colors = ["#4F46E5", "#10B981", "#F59E0B"];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey={filterType === "year" ? "month" : "date"} 
          tickFormatter={formatXAxis}
          stroke="#6B7280"
          fontSize={12}
        />
        <YAxis
          tickFormatter={formatYAxis}
          domain={[0, maxValue * 1.1]}
          stroke="#6B7280"
          fontSize={12}
        />
        <Tooltip 
          formatter={(value) => new Intl.NumberFormat('en-US').format(value)}
          contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px' }}
        />
        <Legend />
        {keys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index]}
            fill={`url(#color${index})`}
            fillOpacity={0.3}
          />
        ))}
        {keys.map((key, index) => (
          <defs key={key}>
            <linearGradient id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[index]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors[index]} stopOpacity={0}/>
            </linearGradient>
          </defs>
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;