import React, { useState, useEffect, useCallback } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Building2, Truck, Users, Package, ShoppingCart } from "lucide-react";
// import MiniLineChart from "../../components/admin/chart/MiniLineChart";
import AreaChart from "../../components/admin/chart/AreaChart";

const DashBoard = () => {
  const [cookies] = useCookies(["token"]);
  const [, setErrosMess] = useState("");
  const [totalDepot, setTotalDepot] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalVehicle, setTotalVehicle] = useState(0);
  const [totalPartner, setTotalPartner] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [itemsSoldData, setItemsSoldData] = useState([]);
  const [TopPartnerData, setTopPartnerData] = useState([]);
  const [TopProductData, setTopProductData] = useState([]);
  const [activeTab, setActiveTab] = useState("revenues");
  const [filterType, setFilterType] = useState("month");
  const [metric_type_partner, setMetricTypePartner] = useState("revenue");
  const [metric_type_product, setMetricTypeProduct] = useState("sale");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [transportCostData, setTransportCostData] = useState([]);
  const getColorByStatus = (status) => {
    switch (status) {
      case "Cancelled":
        return "#FF6B6B";
      case "Success":
        return "#4CAF50";
      case "Delivery":
        return "#3498DB";
      case "Pending":
        return "#FFA500";
      case "Waiting":
        return "#d334db";
      default:
        return "#000000";
    }
  };

  const fetchOrderStatusData = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `/api/management/admin/dashboard/order-status?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setOrderStatusData(
            Object.entries(data.data).map(([name, value]) => ({
              name,
              value,
              color: getColorByStatus(name),
            }))
          );
        } else {
          console.error("Failed to fetch order status data");
        }
      } catch (error) {
        console.error("Error fetching order status data:", error);
      }
    },
    [cookies.token]
  );

  useEffect(() => {
    fetchOrderStatusData(selectedYear, filterType, selectedMonth);
  }, [selectedYear, filterType, selectedMonth, fetchOrderStatusData]);

  const fetchTransportCostData = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `/api/management/admin/dashboard/transport-cost?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setTransportCostData(data.data);
        } else {
          console.error("Failed to fetch transportation cost data");
        }
      } catch (error) {
        console.error("Error fetching transportation cost data:", error);
      }
    },
    [cookies.token]
  );

  useEffect(() => {
    fetchTransportCostData(selectedYear, filterType, selectedMonth);
  }, [selectedYear, filterType, selectedMonth, fetchTransportCostData]);

  const handleMetricPartnerTypeChange = (type) => {
    setMetricTypePartner(type);
    fetchTopPartner(selectedYear, filterType, selectedMonth, type);
  };

  const handleMetricProductTypeChange = (type) => {
    setMetricTypeProduct(type);
    fetchTopProduct(selectedYear, filterType, selectedMonth, type);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);

    if (event.target.value === "year") {
      fetchData(selectedYear, event.target.value);
    } else {
      fetchData(selectedYear, event.target.value, selectedMonth);
    }
  };

  const handleYearChange = (date) => {
    const selectedYear = date.getFullYear();
    setSelectedYear(selectedYear);
    fetchData(selectedYear, filterType);
  };

  const handleMonthChange = (date) => {
    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth() + 1;

    setSelectedYear(selectedYear);
    setSelectedMonth(selectedMonth);

    fetchData(selectedYear, "month", selectedMonth);
  };

  const fetchTopPartner = useCallback(
    async (year, filterType, month, metric_type_partner) => {
      try {
        let url = `/api/management/admin/dashboard/top-partners?year=${year}&filter_type=${filterType}&metric_type=${metric_type_partner}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setTopPartnerData(data.data);
        } else {
          console.error("Failed to fetch items sold data");
        }
      } catch (error) {
        console.error("Error fetching items sold data:", error);
      }
    },
    [cookies.token]
  );
  const fetchTopProduct = useCallback(
    async (year, filterType, month, metric_type_product) => {
      try {
        let url = `/api/management/admin/dashboard/top-products?year=${year}&filter_type=${filterType}&metric_type=${metric_type_product}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setTopProductData(data.data);
        } else {
          console.error("Failed to fetch items sold data");
        }
      } catch (error) {
        console.error("Error fetching items sold data:", error);
      }
    },
    [cookies.token]
  );

  useEffect(() => {
    fetchTopPartner(
      selectedYear,
      filterType,
      selectedMonth,
      metric_type_partner
    );
  }, [
    selectedYear,
    filterType,
    selectedMonth,
    metric_type_partner,
    fetchTopPartner,
    activeTab,
  ]);

  useEffect(() => {
    fetchTopProduct(
      selectedYear,
      filterType,
      selectedMonth,
      metric_type_product
    );
  }, [
    selectedYear,
    filterType,
    selectedMonth,
    metric_type_product,
    fetchTopProduct,
    activeTab,
  ]);

  const fetchRevenueData = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `/api/management/admin/dashboard/revenue-summary?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setRevenueData(data.data);
        } else {
          console.error("Failed to fetch revenue data");
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    },
    [cookies.token]
  );
  const fetchItemsSoldData = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `/api/management/admin/dashboard/itemsold-summary?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setItemsSoldData(data.data);
        } else {
          console.error("Failed to fetch items sold data");
        }
      } catch (error) {
        console.error("Error fetching items sold data:", error);
      }
    },
    [cookies.token]
  );
  const fetchData = useCallback(
    async (year, filterType, month) => {
      fetchRevenueData(year, filterType, month);
      fetchItemsSoldData(year, filterType, month);
    },
    [fetchItemsSoldData, fetchRevenueData]
  );
  useEffect(() => {
    fetchData(selectedYear, filterType, selectedMonth);
  }, [filterType, fetchData, activeTab, selectedYear, selectedMonth]);
  // Tương tự cho các loại đơn hàng khác
  const handleLoadData = useCallback(async () => {
    let url = `/api/management/admin/dashboard/total-all`;

    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + cookies.token,
      },
    });
    if (response.status === 200) {
      const body = await response.json();
      setTotalDepot(body.totalDepots);
      setTotalOrder(body.totalOrders);
      setTotalVehicle(body.totalVehicles);
      setTotalPartner(body.totalPartners);
      setTotalProduct(body.totalProduct);
    } else {
      setErrosMess("Failed to fetch data");
    }
  }, [cookies.token]);

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  return (
    <div className="w-full">
      <div className="mx-4 flex flex-wrap">
        <div className="w-full md:w-1/5 p-2">
          <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Total Depot
              </p>
              <h2 className="text-3xl font-bold">{totalDepot}</h2>
            </div>
            <Building2 size={48} className="text-indigo-600" />
          </div>
        </div>
        <div className="w-full md:w-1/5 p-2">
          <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Total Vehicle
              </p>
              <h2 className="text-3xl font-bold">{totalVehicle}</h2>
            </div>
            <Truck size={48} className="text-indigo-600" />
          </div>
        </div>
        <div className="w-full md:w-1/5 p-2">
          <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Total Partner
              </p>
              <h2 className="text-3xl font-bold">{totalPartner}</h2>
            </div>
            <Users size={48} className="text-indigo-600" />
          </div>
        </div>
        <div className="w-full md:w-1/5 p-2">
          <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Total Product
              </p>
              <h2 className="text-3xl font-bold">{totalProduct}</h2>
            </div>
            <Package size={48} className="text-indigo-600" />
          </div>
        </div>
        <div className="w-full md:w-1/5 p-2">
          <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Total Order
              </p>
              <h2 className="text-3xl font-bold">{totalOrder}</h2>
            </div>
            <ShoppingCart size={48} className="text-indigo-600" />
          </div>
        </div>
      </div>
      {/* ... */}
      {/* Thay đổi kiểu chữ và màu sắc của nút radio */}
      {/* Filter and Date Picker */}
      <div className="mx-4 mt-4 flex justify-end items-center">
        <div className="flex items-center mr-4">
          <label className="mr-2 text-gray-700 font-semibold">
            <input
              type="radio"
              value="year"
              checked={filterType === "year"}
              onChange={handleFilterTypeChange}
              className="mr-1 text-indigo-600"
            />
            Year
          </label>
          <label className="text-gray-700 font-semibold">
            <input
              type="radio"
              value="month"
              checked={filterType === "month"}
              onChange={handleFilterTypeChange}
              className="mr-1 text-indigo-600"
            />
            Month
          </label>
        </div>
        {filterType === "year" ? (
          <DatePicker
            selected={new Date(selectedYear, 0)}
            onChange={handleYearChange}
            showYearPicker
            dateFormat="yyyy"
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-gray-700 font-semibold"
          />
        ) : (
          <DatePicker
            selected={new Date(selectedYear, selectedMonth - 1)}
            onChange={handleMonthChange}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-gray-700 font-semibold"
          />
        )}
      </div>
      {/* ... */}
      {/* Transport Information Charts */}
      <div className="mx-4 mt-4 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Transport Information Charts
        </h3>
        <div className="flex flex-wrap">
          {/* Order Status Pie Chart */}
          <div className="w-full md:w-1/2 p-2">
            <h4 className="text-md font-semibold text-gray-700 mb-2">
              Order Status
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  formatter={(value, entry, index) => (
                    <span style={{ color: entry.color }}>
                      {value} ({entry.payload.value})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Transport Cost Line Chart */}
          <div className="w-full md:w-1/2 p-2">
            <h4 className="text-md font-semibold text-gray-700 mb-2">
              Transportation Costs
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={transportCostData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={filterType === "year" ? "month" : "date"} />
                <YAxis
                  tickFormatter={(value) => {
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
                  }}
                />
                <Tooltip
                  formatter={(value) => {
                    return new Intl.NumberFormat("en-US").format(value);
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="labor_cost"
                  stroke="#FF6B6B"
                  name="Labor Cost"
                />
                <Line
                  type="monotone"
                  dataKey="moving_cost"
                  stroke="#48BB78"
                  name="Moving Cost"
                />
                <Line
                  type="monotone"
                  dataKey="total_cost"
                  stroke="#4299E1"
                  activeDot={{ r: 6 }}
                  name="Total Cost"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Thay đổi kiểu chữ và màu sắc của tiêu đề và tab */}
      <div className="bg-white mt-4 mx-4 rounded-lg flex">
        <div className="flex-1 pt-4 pl-4 pr-4 pb-1">
          <p className="text-lg font-semibold text-gray-800">
            Summary Revenues
          </p>
          <div className="flex justify-end pr-8">
            <div
              className={`px-4 py-2 border border-gray-400 rounded-tl-lg rounded-bl-lg cursor-pointer ${
                activeTab === "revenues"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 font-semibold"
              }`}
              onClick={() => setActiveTab("revenues")}
            >
              Revenues
            </div>
            <div
              className={`px-4 py-2 border border-gray-400 cursor-pointer ${
                activeTab === "itemsSold"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 font-semibold"
              }`}
              onClick={() => setActiveTab("itemsSold")}
            >
              Items Sold
            </div>
            <div className="px-4 py-2 border border-gray-400 text-gray-700 font-semibold">
              Profit
            </div>
            <div className="px-4 py-2 border border-gray-400 rounded-tr-lg rounded-br-lg text-gray-700 font-semibold">
              Cost
            </div>
          </div>
          <div>
            {activeTab === "revenues" ? (
              <AreaChart
                data={revenueData}
                filterType={filterType}
                dataKey="revenue"
              />
            ) : (
              <AreaChart
                data={itemsSoldData}
                filterType={filterType}
                dataKey="item sold"
              />
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="text-xl font-semibold text-gray-800">Summary</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total income</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  600,000,000
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Item Sold</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">5403</p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total Profit</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  365,410,000
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end">
              <div>
                <p className="text-gray-700 font-semibold">Total Cost</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  234,590,000
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Thay đổi kiểu chữ và màu sắc của tiêu đề và tab */}
      <div className="mt-4 mx-4 flex gap-5">
        <div className="flex-1">
          <div className="bg-white rounded-lg pb-2 shadow-md">
            <div className="flex justify-between items-center rounded-t-lg py-2 px-4">
              <p className="text-lg font-semibold text-gray-800">
                Top Partners
              </p>
              <div className="flex items-center">
                <div
                  className={`px-4 py-2 border border-gray-400 cursor-pointer ${
                    metric_type_partner === "amount"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 font-semibold"
                  }`}
                  onClick={() => handleMetricPartnerTypeChange("amount")}
                >
                  Amount
                </div>
                <div
                  className={`px-4 py-2 border border-gray-400 cursor-pointer ${
                    metric_type_partner === "revenue"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 font-semibold"
                  }`}
                  onClick={() => handleMetricPartnerTypeChange("revenue")}
                >
                  Revenue
                </div>
              </div>
            </div>
            <div className="overflow-y-auto h-96">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4 font-semibold">#</th>
                    <th className="py-2 px-4 font-semibold">Partner Name</th>
                    <th className="py-2 px-4 font-semibold">
                      {metric_type_partner === "amount"
                        ? "Total Revenue"
                        : "Total Sale"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TopPartnerData.map((partner, idx) => (
                    <tr
                      key={partner.partner_id}
                      className="border-b border-gray-200"
                    >
                      <td className="py-2 px-4 text-gray-700 font-semibold">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-4 text-gray-700">
                        {partner.partner_name}
                      </td>
                      <td className="py-2 px-4 text-gray-700 font-semibold">
                        {partner.total
                          ? parseFloat(partner.total).toLocaleString("en-US", {
                              maximumSignificantDigits: 20,
                            })
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-lg pb-2 shadow-md">
            <div className="flex justify-between items-center rounded-t-lg py-2 px-4">
              <p className="text-lg font-semibold text-gray-800">
                Top Products
              </p>
              <div className="flex items-center">
                <div
                  className={`px-4 py-2 border border-gray-400 cursor-pointer ${
                    metric_type_product === "quantity"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 font-semibold"
                  }`}
                  onClick={() => handleMetricProductTypeChange("quantity")}
                >
                  Quantity
                </div>
                <div
                  className={`px-4 py-2 border border-gray-400 cursor-pointer ${
                    metric_type_product === "sale"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 font-semibold"
                  }`}
                  onClick={() => handleMetricProductTypeChange("sale")}
                >
                  Sale
                </div>
              </div>
            </div>
            <div className="overflow-y-auto h-96">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4 font-semibold">#</th>
                    <th className="py-2 px-4 font-semibold">Product Name</th>
                    <th className="py-2 px-4 font-semibold">
                      {metric_type_product === "quantity"
                        ? "Total Quantity"
                        : "Total Sale"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TopProductData.map((product, idx) => (
                    <tr
                      key={product.product_id}
                      className="border-b border-gray-200"
                    >
                      <td className="py-2 px-4 text-gray-700 font-semibold">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-4 text-gray-700">
                        {product.product_name}
                      </td>
                      <td className="py-2 px-4 text-gray-700 font-semibold">
                        {product.total
                          ? parseFloat(product.total).toLocaleString("en-US", {
                              maximumSignificantDigits: 20,
                            })
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
