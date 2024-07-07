import React, { useState, useEffect, useCallback, useRef } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSortIcon, handleSort, formatNumber } from "../../utils/commonUtils";
import { useTableDragScroll } from "../../hooks/useTableDragScroll";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PartnerCommissionStats() {
  const [orderBy, setOrderBy] = useState("stat_date");
  const [sortBy, setSortBy] = useState("asc");
  const [stats, setStats] = useState({ total_stats: {}, detailed_stats: [] });
  const [cookies] = useCookies(["token"]);

  const [filterType, setFilterType] = useState("month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handleLoadData = useCallback(async () => {
    try {
      let url = `/api/management/partner/stats?year=${selectedYear}&filter_type=${filterType}&order_by=${orderBy}&sort_by=${sortBy}`;
      if (filterType === "month") {
        url += `&month=${selectedMonth}`;
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
        setStats(data.data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }, [selectedYear, selectedMonth, filterType, orderBy, sortBy, cookies.token]);

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleYearChange = (date) => {
    setSelectedYear(date.getFullYear());
  };

  const handleMonthChange = (date) => {
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth() + 1);
  };

  const renderTableHeader = () => (
    <tr>
      {[
        { label: "Date", key: "stat_date" },
        { label: "Total Revenue", key: "revenue" },
        { label: "Total Base Price", key: "total_base_price" },
        { label: "Commission", key: "commission" },
        { label: "Bonus", key: "bonus" },
        { label: "Total Amount", key: "total_amount" },
        { label: "Order Count", key: "order_count" },
      ].map((column, index) => (
        <th
          key={column.label}
          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${
            index !== 6 ? "border-r border-gray-200" : ""
          }`}
          onClick={() =>
            handleSort(column.key, orderBy, sortBy, setOrderBy, setSortBy)
          }
        >
          <div className="flex items-center">
            <span>{column.label}</span>
            <span className="ml-1">
              {getSortIcon(column.key, orderBy, sortBy)}
            </span>
          </div>
        </th>
      ))}
    </tr>
  );

  const renderTableBody = () =>
    stats.detailed_stats.map((item) => (
      <tr key={item.stat_date} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
          {item.stat_date}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.revenue)} ₫
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.total_base_price)} ₫
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.commission)} ₫
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.bonus)} ₫
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.total_amount)} ₫
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatNumber(item.order_count)}
        </td>
      </tr>
    ));

  return (
    <div className="flex justify-center bg-white p-3 m-3 rounded-md">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {filterType === "year" ? "Yearly" : "Monthly"} Commission Statistics
          </h2>
          <div className="flex items-center space-x-4">
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
            {filterType === "year" ? (
              <div className="flex items-center">
                <DatePicker
                  selected={new Date(selectedYear, 0)}
                  onChange={handleYearChange}
                  showYearPicker
                  dateFormat="yyyy"
                  className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-gray-700 font-semibold"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <DatePicker
                  selected={new Date(selectedYear, selectedMonth - 1)}
                  onChange={handleMonthChange}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-gray-700 font-semibold"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mb-4 bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Total Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Total Revenue:</p>
              <p>{formatNumber(stats.total_stats.revenue)} ₫</p>
            </div>
            <div>
              <p className="font-medium">Total Commission:</p>
              <p>{formatNumber(stats.total_stats.commission)} ₫</p>
            </div>
            <div>
              <p className="font-medium">Total Orders:</p>
              <p>{formatNumber(stats.total_stats.order_count)}</p>
            </div>
          </div>
        </div>
        <div
          className="overflow-x-auto cursor-grab active:cursor-grabbing"
          ref={tableRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">{renderTableHeader()}</thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PartnerCommissionStats;