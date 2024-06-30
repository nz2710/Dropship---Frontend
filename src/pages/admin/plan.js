import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlanDetailForm from "../../components/admin/plan/PlanDetailForm";
import {
  getSortIcon,
  handleSort,
  handleDelete,
  formatNumber,
} from "../../utils/commonUtils";
import { useTableDragScroll } from "../../hooks/useTableDragScroll";

function Plan() {
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [currentRoutePage, setCurrentRoutePage] = useState(1);
  const [routePageCount, setRoutePageCount] = useState(0);
  const [selectedPlanRoutes, setSelectedPlanRoutes] = useState(null);
  const dataPerPage = 10;
  const [cookies] = useCookies(["token"]);

  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
    handleLoadData(selectedPage + 1);
  };

  const handleLoadData = useCallback(
    async (page = currentPage) => {
      const url = new URL(`${API_URL2}/api/admin/routing`);
      url.searchParams.append("pageSize", dataPerPage);
      url.searchParams.append("order_by", orderBy);
      url.searchParams.append("sort_by", sortBy);
      url.searchParams.append("page", page);

      if (searchTerm) {
        url.searchParams.append(searchType, searchTerm);
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        if (response.status === 200) {
          const body = (await response.json()).data;
          setCurrentPageData(body.data);
          setPageCount(body.last_page);
          setCurrentPage(body.data.length === 0 && page > 1 ? page - 1 : page);
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
      searchType,
      sortBy,
    ]
  );

  useEffect(() => {
    handleLoadData();
  }, [currentPage, searchType, searchTerm, orderBy, sortBy, handleLoadData]);

  const handleShowDetail = async (item) => {
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/routing/${item.id}?page=1&pageSize=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );
      if (response.status === 200) {
        const body = await response.json();
        setSelectedPlan(body.data);
        setSelectedPlanRoutes(body.data.routes);
        setCurrentRoutePage(body.current_page);
        setRoutePageCount(body.last_page);
        setShowDetailForm(true);
      } else {
        throw new Error("Failed to fetch plan details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleConfirm = async (planId) => {
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/plans/${planId}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );

      if (response.ok) {
        toast.success("Plan confirmed successfully");
        handleLoadData(currentPage); // Reload data after confirming
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm plan");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleComplete = async (planId) => {
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/plans/${planId}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );

      if (response.ok) {
        toast.success("Plan completed successfully");
        handleLoadData(currentPage); // Reload data after completing
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to complete plan");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleRoutePageChange = async (selectedPage) => {
    const currentPage = selectedPage.selected + 1;
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/routing/${selectedPlan.id}?page=${currentPage}&pageSize=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );

      if (response.status === 200) {
        const body = await response.json();
        setSelectedPlanRoutes(body.data.routes);
        setCurrentRoutePage(body.current_page);
      } else {
        throw new Error("Failed to fetch partner orders");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleCloseDetailForm = () => {
    setSelectedPlan(null);
    setShowDetailForm(false);
  };

  const renderTableHeader = () => (
    <tr>
      {[
        { label: "ID", key: "id" },
        { label: "Name", key: "name" },
        { label: "Distance (km)", key: "total_distance" },
        { label: "Time (min)", key: "total_time_serving" },
        { label: "Weight (kg)", key: "total_demand" },
        { label: "Fee (VND)", key: "fee" },
        { label: "Value (VND)", key: "total_plan_value" },
        { label: "Profit (VND)", key: "profit" },
        { label: "Status", key: "status" },
        { label: "Actions", key: null },
      ].map((column, index) => (
        <th
          key={column.label}
          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
            column.key ? "cursor-pointer" : ""
          } ${index !== 9 ? "border-r border-gray-200" : ""}`}
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
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
          {item.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.total_distance, 2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.total_time_serving, 0)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.total_demand, 2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.fee)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.total_plan_value)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.profit)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              item.status === "Success"
                ? "bg-green-100 text-green-800"
                : item.status === "Delivery"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            {item.status === "Pending" ? (
              <button
                onClick={() => handleConfirm(item.id)}
                className="text-blue-600 hover:text-blue-900"
                title="Confirm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : item.status === "Delivery" ? (
              <button
                onClick={() => handleComplete(item.id)}
                className="text-green-600 hover:text-green-900"
                title="Complete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : null}
            <button
              onClick={() => handleShowDetail(item)}
              className="text-yellow-600 hover:text-yellow-900"
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
            <button
              onClick={() =>
                handleDelete(
                  `${API_URL2}/api/admin/routing`,
                  item.id,
                  cookies.token,
                  () => handleLoadData(currentPage)
                )
              }
              className="text-red-600 hover:text-red-900"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
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
        {!showDetailForm ? (
          <>
            <div className="mb-4 flex justify-between">
              <div className="flex-grow flex items-center">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md mr-2"
                >
                  <option value="name">Name</option>
                  {/* <option value="status">Status</option> */}
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${searchType}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
                />
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
            {pageCount > 0 && (
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
          <PlanDetailForm
            plan={selectedPlan}
            onClose={handleCloseDetailForm}
            routes={selectedPlanRoutes}
            currentPage={currentRoutePage}
            pageCount={routePageCount}
            onPageChange={handleRoutePageChange}
          />
        )}
      </div>
    </div>
  );
}
export default Plan;
