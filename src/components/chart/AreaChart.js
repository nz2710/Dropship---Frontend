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

const AreaChartComponent = ({ data, filterType, dataKey }) => {
  const formatXAxis = (tickItem) => {
    if (filterType === "year") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months[tickItem - 1];
    } else {
      return tickItem;
    }
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    return `${parseFloat(value)}`;
  };

  // Tìm giá trị doanh thu lớn nhất trong dữ liệu
  const maxRevenue = Math.max(...data.map((item) => parseFloat(item.revenue)));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={filterType === "year" ? "month" : "date"}
          tickFormatter={formatXAxis}
        />
        {/* Đặt yDomain với giá trị lớn hơn maxRevenue một chút để đảm bảo hiển thị đầy đủ dữ liệu */}
        <YAxis
          tickFormatter={formatYAxis}
          domain={[0, maxRevenue]} // Tăng giá trị tối đa lên 10% để hiển thị đầy đủ dữ liệu
        />
        <Tooltip formatter={(value) => `${parseFloat(value)}`} />
        <Legend />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#2563EB"
          fill="url(#color)"
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
