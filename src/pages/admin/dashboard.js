import React, { useState, useEffect, useCallback } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatNumber } from "../../utils/commonUtils";
import { Building2, Truck, Users, Package, ShoppingCart } from "lucide-react";
// import MiniLineChart from "../../components/admin/chart/MiniLineChart";
import AreaChart from "../../components/admin/chart/AreaChart";
import CustomPieChart from "../../components/admin/chart/PieChart";
import CustomLineChart from "../../components/admin/chart/LineChart";

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
  const [profitData, setProfitData] = useState([]);
  const [costData, setCostData] = useState([]);
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
  const [totalCost, setTotalCost] = useState(0);
  const [summaryData, setSummaryData] = useState({});

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

  const [avgDistance, setAvgDistance] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);
  const [avgWeight, setAvgWeight] = useState(0);
  const [avgVehicles, setAvgVehicles] = useState(0);
  const [avgShippingCostPerOrder, setAvgShippingCostPerOrder] = useState(0);
  const [avgOrdersPerTrip, setAvgOrdersPerTrip] = useState(0);
  const [avgTripsPerMonth, setAvgTripsPerMonth] = useState(0);
  const [avgEfficiency, setAvgEfficiency] = useState(0);

  const fetchOrderStatusData = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `${API_URL2}/api/admin/dashboard/order-status?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
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
        let url = `${API_URL2}/api/admin/dashboard/transport-cost?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
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

  useEffect(() => {
    const totalCost = transportCostData.reduce(
      (sum, item) => sum + item.total_cost,
      0
    );
    setTotalCost(totalCost);
  }, [transportCostData]);

  const fetchAverageStats = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `${API_URL2}/api/admin/dashboard/average?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setAvgDistance(data.data.avg_distance);
          setAvgDuration(data.data.avg_duration);
          setAvgWeight(data.data.avg_weight);
          setAvgVehicles(data.data.avg_vehicles);
        } else {
          console.error("Failed to fetch average stats");
        }
      } catch (error) {
        console.error("Error fetching average stats:", error);
      }
    },
    [cookies.token]
  );

  useEffect(() => {
    fetchAverageStats(selectedYear, filterType, selectedMonth);
  }, [selectedYear, filterType, selectedMonth, fetchAverageStats]);

  const fetchTransportationMetrics = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `${API_URL2}/api/admin/dashboard/metric?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setAvgShippingCostPerOrder(data.data.avg_shipping_cost_per_order);
          setAvgOrdersPerTrip(data.data.avg_orders_per_trip);
          setAvgTripsPerMonth(data.data.avg_trips_per_month);
          setAvgEfficiency(data.data.avg_efficiency);
        } else {
          console.error("Failed to fetch transportation metrics");
        }
      } catch (error) {
        console.error("Error fetching transportation metrics:", error);
      }
    },
    [cookies.token]
  );

  useEffect(() => {
    fetchTransportationMetrics(selectedYear, filterType, selectedMonth);
  }, [selectedYear, filterType, selectedMonth, fetchTransportationMetrics]);

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
        let url = `${API_URL2}/api/admin/dashboard/top-partners?year=${year}&filter_type=${filterType}&metric_type=${metric_type_partner}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
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
        let url = `${API_URL2}/api/admin/dashboard/top-products?year=${year}&filter_type=${filterType}&metric_type=${metric_type_product}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
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
        let url = `${API_URL2}/api/admin/dashboard/revenue-summary?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
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
        let url = `${API_URL2}/api/admin/dashboard/itemsold-summary?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
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
  const fetchProfitData = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `${API_URL2}/api/admin/dashboard/profit-summary?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setProfitData(data.data);
        } else {
          console.error("Failed to fetch profit data");
        }
      } catch (error) {
        console.error("Error fetching profit data:", error);
      }
    },
    [cookies.token]
  );
  const fetchCostData = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `${API_URL2}/api/admin/dashboard/cost-summary?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setCostData(data.data);
        } else {
          console.error("Failed to fetch cost data");
        }
      } catch (error) {
        console.error("Error fetching cost data:", error);
      }
    },
    [cookies.token]
  );

  const fetchSummaryData = useCallback(
    async (year, filterType, month) => {
      try {
        let url = `${API_URL2}/api/admin/dashboard/summary?year=${year}&filter_type=${filterType}`;
        if (filterType === "month" && month) {
          url += `&month=${month}`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setSummaryData(data.data);
        } else {
          console.error("Failed to fetch summary data");
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    },
    [cookies.token]
  );

  const fetchData = useCallback(
    async (year, filterType, month) => {
      fetchRevenueData(year, filterType, month);
      fetchItemsSoldData(year, filterType, month);
      fetchProfitData(year, filterType, month);
      fetchCostData(year, filterType, month);
      fetchSummaryData(year, filterType, month);
    },
    [
      fetchRevenueData,
      fetchItemsSoldData,
      fetchProfitData,
      fetchCostData,
      fetchSummaryData,
    ]
  );

  useEffect(() => {
    fetchData(selectedYear, filterType, selectedMonth);
  }, [filterType, fetchData, activeTab, selectedYear, selectedMonth]);
  // Tương tự cho các loại đơn hàng khác
  const handleLoadData = useCallback(async () => {
    const url = new URL(`${API_URL2}/api/admin/dashboard/total-all`);

    const response = await fetch(url, {
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

  // Calculate percentage change
  // const calculatePercentageChange = (current, previous) => {
  //   if (previous === 0) return 100;
  //   return ((current - previous) / previous) * 100;
  // };

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
          Shipping Overview
        </h3>
        <div className="flex flex-wrap mb-4">
          <div className="w-full md:w-1/4 p-2">
            <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Avg Distance (km)
                </p>
                <h2 className="text-3xl font-bold">
                  {formatNumber(avgDistance)}
                </h2>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525"
                />
              </svg>
            </div>
          </div>

          <div className="w-full md:w-1/4 p-2">
            <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Avg Duration (hours)
                </p>
                <h2 className="text-3xl font-bold">
                  {formatNumber(avgDuration / 60)}
                </h2>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div className="w-full md:w-1/4 p-2">
            <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Avg Weight (kg)
                </p>
                <h2 className="text-3xl font-bold">
                  {formatNumber(avgWeight)}
                </h2>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                />
              </svg>
            </div>
          </div>

          <div className="w-full md:w-1/4 p-2">
            <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between h-full">
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Avg Vehicles
                </p>
                <h2 className="text-3xl font-bold">
                  {formatNumber(avgVehicles)}
                </h2>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap">
          {/* Order Status Pie Chart */}
          <div className="w-full md:w-1/2 p-2">
            <h4 className="text-md font-semibold text-gray-700 mb-2">
              Order Status
            </h4>
            <CustomPieChart data={orderStatusData} />
          </div>
          {/* Transport Cost Line Chart */}
          <div className="w-full md:w-1/2 p-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-semibold text-gray-700">
                Transportation Costs
              </h4>
              <div className="text-lg font-semibold text-gray-700">
                Total: {formatNumber(totalCost)}
              </div>
            </div>
            <CustomLineChart data={transportCostData} filterType={filterType} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md mb-2 mt-4">
          <div className="flex">
            <div className="flex-1 text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Avg Trips
              </p>
              <h2 className="text-3xl font-bold">
                {Math.round(avgTripsPerMonth)}
              </h2>
            </div>
            <div className="w-px bg-gray-300"></div>
            <div className="flex-1 text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Avg Orders per Trip
              </p>
              <h2 className="text-3xl font-bold">
                {Math.round(avgOrdersPerTrip)}
              </h2>
            </div>
            <div className="w-px bg-gray-300"></div>
            <div className="flex-1 text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Avg Trans. Cost per Order
              </p>
              <h2 className="text-3xl font-bold">
                {formatNumber(avgShippingCostPerOrder)}
              </h2>
            </div>
            <div className="w-px bg-gray-300"></div>
            <div className="flex-1 text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Avg Trans. Efficiency
              </p>
              <h2 className="text-3xl font-bold">
                {formatNumber(avgEfficiency) * 100}%
              </h2>
            </div>
          </div>
        </div>
      </div>
      {/* Thay đổi kiểu chữ và màu sắc của tiêu đề và tab */}
      <div className="bg-white mt-4 mx-4 rounded-lg flex">
        <div className="flex-1 pt-4 pl-4 pr-4 pb-1">
          <p className="text-lg font-semibold text-gray-800">Sales Overview</p>
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
              Quantity Sold
            </div>
            <div
              className={`px-4 py-2 border border-gray-400 cursor-pointer ${
                activeTab === "profit"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 font-semibold"
              }`}
              onClick={() => setActiveTab("profit")}
            >
              Profit
            </div>
            <div
              className={`px-4 py-2 border border-gray-400 rounded-tr-lg rounded-br-lg cursor-pointer ${
                activeTab === "cost"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 font-semibold"
              }`}
              onClick={() => setActiveTab("cost")}
            >
              Cost
            </div>
          </div>
          <div>
            {activeTab === "revenues" && (
              <AreaChart
                data={revenueData}
                filterType={filterType}
                dataKeys="revenue"
              />
            )}
            {activeTab === "itemsSold" && (
              <AreaChart
                data={itemsSoldData}
                filterType={filterType}
                dataKeys="item sold"
              />
            )}
            {activeTab === "profit" && (
              <AreaChart
                data={profitData}
                filterType={filterType}
                dataKeys="profit"
              />
            )}
            {activeTab === "cost" && (
              <AreaChart
                data={costData}
                filterType={filterType}
                dataKeys={["cost", "commission", "total"]}
              />
            )}
          </div>
        </div>
        <div className="p-4 w-1/5">
          <p className="text-xl font-semibold text-gray-800 mb-4">Summary</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total Revenue</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  {formatNumber(summaryData.total_revenue)}
                </p>
              </div>
              {/* You might want to calculate percentage change here */}
            </div>
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Sales Volume</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  {formatNumber(summaryData.total_sales_volume)}
                </p>
              </div>
            </div>
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total Profit</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  {formatNumber(summaryData.total_profit)}
                </p>
              </div>
            </div>
            <div className="flex items-end">
              <div>
                <p className="text-gray-700 font-semibold">Total Cost</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  {formatNumber(summaryData.total_cost)}
                </p>
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
                        ? "Total Order"
                        : "Total Revenue"}
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
                          ? parseFloat(partner.total).toLocaleString("en-US")
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
                          ? parseFloat(product.total).toLocaleString("en-US")
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
