import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;

  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  const handleLoadData = useCallback(
    async (page = currentPage) => {
      try {
        let url = `${API_URL2}/api/partner/stats?year=${selectedYear}&filter_type=${filterType}&order_by=${orderBy}&sort_by=${sortBy}&page=${page}&pageSize=${pageSize}`;
        if (filterType === "month") {
          url += `&month=${selectedMonth}`;
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
          setStats(data.data);
          setPageCount(data.data.detailed_stats.last_page || 1);
          setCurrentPage(data.data.detailed_stats.current_page || 1);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    },
    [
      selectedYear,
      selectedMonth,
      filterType,
      orderBy,
      sortBy,
      currentPage,
      pageSize,
      cookies.token,
    ]
  );

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (date) => {
    setSelectedYear(date.getFullYear());
    setCurrentPage(1);
  };

  const handleMonthChange = (date) => {
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth() + 1);
    setCurrentPage(1);
  };

  const renderTableHeader = () => {
    if (filterType === "year") {
      return (
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
    } else {
      return (
        <tr>
          {[
            { label: "Date", key: "created_at" },
            { label: "Order Code", key: "code_order" },
            { label: "Price", key: "price" },
            { label: "Total Base Price", key: "total_base_price" },
            { label: "Commission", key: "commission" },
            { label: "Status", key: "status" },
          ].map((column, index) => (
            <th
              key={column.label}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${
                index !== 5 ? "border-r border-gray-200" : ""
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
    }
  };

  const renderTableBody = () => {
    if (filterType === "year") {
      if (Array.isArray(stats.detailed_stats)) {
        return stats.detailed_stats.map((item) => (
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
      } else {
        return (
          <tr>
            <td
              colSpan="7"
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
            >
              No data found
            </td>
          </tr>
        );
      }
    } else {
      if (
        stats.detailed_stats.orders &&
        stats.detailed_stats.orders.length > 0
      ) {
        return stats.detailed_stats.orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
              {order.created_at}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
              {order.code_order}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
              {formatNumber(order.price)} ₫
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
              {formatNumber(order.total_base_price)} ₫
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
              {formatNumber(order.commission)} ₫
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === "Success"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Delivery"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "Waiting"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </td>
          </tr>
        ));
      } else {
        return (
          <tr>
            <td
              colSpan="6"
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
            >
              No orders found
            </td>
          </tr>
        );
      }
    }
  };

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
        <div className="mb-4 bg-gray-100 p-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Total Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.total_stats.revenue)} ₫
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="text-gray-500 font-medium">Total Commission</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.total_stats.commission)} ₫
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="text-gray-500 font-medium">Total Amount</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.total_stats.total_amount)} ₫
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="text-gray-500 font-medium">Bonus</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.total_stats.bonus)} ₫
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="text-gray-500 font-medium">Total Orders</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.total_stats.order_count)}
              </p>
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
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={
              "flex justify-center items-center space-x-2 mt-4"
            }
            pageClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
            previousClassName={
              "px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            }
            nextClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
            activeClassName={"!bg-blue-500 text-white"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
            forcePage={currentPage - 1}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
          />
        )}
      </div>
    </div>
  );
}

export default PartnerCommissionStats;
