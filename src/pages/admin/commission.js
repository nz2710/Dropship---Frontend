import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSortIcon, handleSort, formatNumber } from "../../utils/commonUtils";
import { useTableDragScroll } from "../../hooks/useTableDragScroll";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommissionDetailForm from "../../components/admin/commission/CommissionDetailForm";
import { API_URL2 } from "../../utils/constant"

function MonthlyCommissionStats() {
  const [cookies] = useCookies(["token"]);
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedCommissionOrders, setSelectedCommissionOrders] =
    useState(null);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [orderPageCount, setOrderPageCount] = useState(0);
  const dataPerPage = 10;
  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filterType, setFilterType] = useState("month");
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);

  const handleLoadData = useCallback(
    async (page = currentPage) => {
      try {
        let url = `${API_URL2}/api/admin/commission`;
        let params = new URLSearchParams();
        params.append("pageSize", dataPerPage);
        params.append("order_by", orderBy);
        params.append("sort_by", sortBy);
        params.append("page", page);
        params.append("year", selectedMonth.getFullYear());

        if (filterType === "month") {
          params.append("month", selectedMonth.getMonth() + 1);
        }

        params.append("filter_type", filterType);

        if (searchTerm) {
          params.append("search", searchTerm);
        }

        url += '?' + params.toString();

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
          setCurrentPageData(body.data.data);
          setPageCount(body.data.last_page);
          setCurrentPage(
            body.data.data.length === 0 && page > 1 ? page - 1 : page
          );
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    },
    [
      cookies.token,
      currentPage,
      dataPerPage,
      orderBy,
      searchTerm,
      sortBy,
      selectedMonth,
      filterType,
    ]
  );

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleUpdateStats = async () => {
    try {
      let response = await fetch(
        `${API_URL2}/api/admin/commission/update-monthly-stats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Partner monthly stats updated successfully.");
        handleLoadData(currentPage);
      } else {
        throw new Error("Failed to update stats");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleShowDetail = async (item) => {
    try {
      let url = `${API_URL2}/api/admin/commission/${item.partner_id}`;
      let params = new URLSearchParams();
      params.append("page", 1);
      params.append("pageSize", 5);
      params.append("year", selectedMonth.getFullYear());

      if (filterType === "month") {
        params.append("month", selectedMonth.getMonth() + 1);
      }

      params.append("filter_type", filterType);
      url += '?' + params.toString();

      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setSelectedCommission(data.data);
        setSelectedCommissionOrders(data.data.orders);
        setCurrentOrderPage(data.current_page);
        setOrderPageCount(data.last_page);
        setShowDetailForm(true);
      } else {
        throw new Error("Failed to fetch commission details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleOrderPageChange = async (selectedPage) => {
    const currentPage = selectedPage.selected + 1;
    try {
      let url = `${API_URL2}/api/admin/commission/${selectedCommission.partner_id}`
      let params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("pageSize", 5);
      params.append("year", selectedMonth.getFullYear());

      if (filterType === "month") {
        params.append("month", selectedMonth.getMonth() + 1);
      }

      params.append("filter_type", filterType);
      url += '?' + params.toString();
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setSelectedCommissionOrders(data.data.orders);
        setCurrentOrderPage(data.current_page);
      } else {
        throw new Error("Failed to fetch commission orders");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleCloseDetailForm = () => {
    setSelectedCommission(null);
    setShowDetailForm(false);
  };

  const renderTableHeader = () => (
    <tr>
      {[
        { label: "Partner ID", key: "partner_id" },
        { label: "Partner Name", key: "partner_name" },
        { label: "Total Base Price", key: "total_base_price" },
        { label: "Revenue", key: "revenue" },
        { label: "Commission", key: "commission" },
        { label: "Bonus", key: "bonus" },
        { label: "Total Amount", key: "total_amount" },
        { label: "Order Count", key: "order_count" },
        { label: "Operation", key: null },
      ].map((column, index) => (
        <th
          key={column.label}
          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${
            index !== 8 ? "border-r border-gray-200" : ""
          }`}
          onClick={() =>
            column.key &&
            handleSort(column.key, orderBy, sortBy, setOrderBy, setSortBy)
          }
        >
          <div className="flex items-center">
            <span>{column.label}</span>
            {column.key && (
              <span className="ml-1">
                {getSortIcon(column.key, orderBy, sortBy)}
              </span>
            )}
          </div>
        </th>
      ))}
    </tr>
  );

  const renderTableBody = () =>
    currentPageData.map((item) => (
      <tr key={item.partner_id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.partner_id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
          {item.partner_name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.total_base_price)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.revenue)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.commission)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.bonus)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.total_amount)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.order_count}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => handleShowDetail(item)}
            className="text-blue-600 hover:text-blue-900"
            title="View Details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </td>
      </tr>
    ));

  return (
    <div className="flex justify-center bg-white p-3 m-3 rounded-md">
      <ToastContainer />
      <div className="w-full">
        {!showDetailForm ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <select
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                >
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
                <DatePicker
                  selected={selectedMonth}
                  onChange={handleMonthChange}
                  dateFormat={filterType === "month" ? "MM/yyyy" : "yyyy"}
                  showMonthYearPicker={filterType === "month"}
                  showYearPicker={filterType === "year"}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                />
                <input
                  type="text"
                  placeholder="Search by partner name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleUpdateStats}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Stats
              </button>
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
                pageClassName={
                  "px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                }
                previousClassName={
                  "px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                }
                nextClassName={
                  "px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                }
                activeClassName={"!bg-blue-500 text-white"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                forcePage={currentPage - 1}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
              />
            )}
          </>
        ) : (
          <CommissionDetailForm
            commission={selectedCommission}
            orders={selectedCommissionOrders}
            currentPage={currentOrderPage}
            pageCount={orderPageCount}
            onClose={handleCloseDetailForm}
            onPageChange={handleOrderPageChange}
          />
        )}
      </div>
    </div>
  );
}

export default MonthlyCommissionStats;
