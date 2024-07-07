import { useState, useEffect, useCallback } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import AreaChart from "../../components/admin/chart/AreaChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DashBoard = () => {
  const [cookies] = useCookies(["token"]);
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

  return (
    <div className="w-full">
      {/* ... */}
      {/* Thay đổi kiểu chữ và màu sắc của nút radio */}
      <div className="mx-4 mt-4 flex justify-end">
        <div className="flex items-center">
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
      </div>
      {/* Thay đổi kiểu chữ và màu sắc của DatePicker */}
      {filterType === "year" ? (
        <div className="mx-4 mt-2 flex justify-end">
          <div className="flex items-center">
            <DatePicker
              selected={new Date(selectedYear, 0)}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-gray-700 font-semibold"
            />
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-2 flex justify-end">
          <div className="flex items-center">
            <DatePicker
              selected={new Date(selectedYear, selectedMonth - 1)}
              onChange={handleMonthChange}
              showMonthYearPicker
              dateFormat="MM/yyyy"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-gray-700 font-semibold"
            />
          </div>
        </div>
      )}
      {/* ... */}
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
                  $56,365
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total income</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  $56,365
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total income</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  $56,365
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end">
              <div>
                <p className="text-gray-700 font-semibold">Total income</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  $56,365
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
