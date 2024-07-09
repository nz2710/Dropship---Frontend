import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { formatNumber } from '../../utils/commonUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API_URL2 } from "../../utils/constant"

const DashBoard = () => {
  const [cookies] = useCookies(['token']);
  const [dashboardData, setDashboardData] = useState({});
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        const response = await fetch(`${API_URL2}/api/partner/dashboard-stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setDashboardData(data.data);
          setOrderStatusData(
            Object.entries(data.data.order_stats).map(([name, value]) => ({
              name,
              value,
            }))
          );
        } else {
          console.error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, [cookies.token]);

  const COLORS = {
    Waiting: '#d334db',
    Pending: '#FFA500',
    Delivery: '#3498DB',
    Success: '#4CAF50',
    Cancelled: '#FF6B6B',
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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getMaxDomainValue = () => {
    const maxRevenue = dashboardData.revenue;
    const maxCommission = dashboardData.commission;
    return Math.max(maxRevenue, maxCommission);
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Partner Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-md p-4">
          <p className="text-gray-600 font-semibold">Revenue</p>
          <p className="text-2xl font-bold">{formatNumber(dashboardData.revenue)}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <p className="text-gray-600 font-semibold">Commission</p>
          <p className="text-2xl font-bold">{formatNumber(dashboardData.commission)}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <p className="text-gray-600 font-semibold">Bonus</p>
          <p className="text-2xl font-bold">{formatNumber(dashboardData.bonus)}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <p className="text-gray-600 font-semibold">Number of Orders</p>
          <p className="text-2xl font-bold">{formatNumber(dashboardData.number_of_orders)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={orderStatusData}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend formatter={(value, entry, index) => (
                <span style={{ color: COLORS[value] }}>
                  {value} ({entry.payload.value})
                </span>
              )} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-xl font-semibold mb-4">Revenue & Commission</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={[
                {
                  name: 'Revenue',
                  value: dashboardData.revenue,
                },
                {
                  name: 'Commission',
                  value: dashboardData.commission,
                },
              ]}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} domain={[0, getMaxDomainValue()]} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="value" fill="#4F46E5" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
