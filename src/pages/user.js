import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";
import { API_URL } from "../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddUserForm from "../components/user/AddUserForm";
import {
  getSortIcon,
  handleSort,
  handleDelete,
} from "../utils/commonUtils";
import { useTableDragScroll } from "../hooks/useTableDragScroll";

const User = () => {
  const [cookies] = useCookies(["token"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [currentPageData, setCurrentPageData] = useState([]);
  const dataPerPage = 5;
  const [showForm, setShowForm] = useState(false);
  const [searchType, setSearchType] = useState("username");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");

  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  const handleAdd = () => {
    setShowForm(true);
  };

  const handleLoadData = useCallback(async () => {
    const url = new URL(`${API_URL}/api/admin/users`);
    url.searchParams.append("pageSize", dataPerPage);
    url.searchParams.append("page", currentPage);
    url.searchParams.append("order_by", orderBy);
    url.searchParams.append("sort_by", sortBy);

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
        const body = (await response.json()).result;
        setCurrentPageData(body.data);
        setPageCount(body.last_page);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }, [
    cookies.token,
    currentPage,
    dataPerPage,
    orderBy,
    sortBy,
    searchType,
    searchTerm,
  ]);

  const handleUserAdded = () => {
    setShowForm(false);
    handleLoadData();
  };

  const handleBan = async (item) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/ban/user/${item.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      if (response.status === 200) {
        toast.success("User successfully banned.");
        handleLoadData();
      } else {
        throw new Error("Failed to ban user");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleUnBan = async (item) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/unban/user/${item.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      if (response.status === 200) {
        toast.success("User successfully unbanned.");
        handleLoadData();
      } else {
        throw new Error("Failed to unban user");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  useEffect(() => {
    handleLoadData();
  }, [currentPage, orderBy, sortBy, searchType, searchTerm, handleLoadData]);

  const renderTableHeader = () => (
    <tr>
      {[
        { label: "ID", key: "id" },
        { label: "Username", key: "username" },
        { label: "Email", key: "email" },
        { label: "Role", key: null },
        { label: "Status", key: "status" },
        { label: "Action", key: null },
      ].map((column, index) => (
        <th
          key={column.label}
          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
            column.key ? "cursor-pointer" : ""
          } ${index !== 5 ? "border-r border-gray-200" : ""}`}
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
          {item.username}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.email}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.roles.length > 0
            ? item.roles.map((role) => role.name).join(", ")
            : "No roles"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              item.status === 1
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.status === 1 ? "Active" : "Banned"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            {item.status === 1 ? (
              <button
                onClick={() => handleBan(item)}
                className="text-white bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700"
              >
                Ban
              </button>
            ) : (
              <button
                onClick={() => handleUnBan(item)}
                className="text-white bg-green-600 px-3 py-2 rounded-lg hover:bg-green-700"
              >
                Unban
              </button>
            )}
            <button
              onClick={() =>
                handleDelete(
                  `${API_URL}/api/admin/user`,
                  item.id,
                  cookies.token,
                  handleLoadData
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
        {!showForm ? (
          <>
            <div className="mb-4 flex justify-between">
              <div className="flex-grow flex items-center">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md mr-2"
                >
                  <option value="username">Username</option>
                  <option value="email">Email</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${searchType}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <button
                  onClick={handleAdd}
                  className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add
                </button>
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
                containerClassName={"flex justify-center items-center space-x-2 mt-4"}
                pageClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
                previousClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
                nextClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
                activeClassName={"!bg-blue-500 text-white"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                forcePage={currentPage - 1}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
              />
            )}
          </>
        ) : (
          <AddUserForm
            onClose={() => setShowForm(false)}
            onUserAdded={handleUserAdded}
          />
        )}
      </div>
    </div>
  );
};

export default User;