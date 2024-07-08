import React, { useState, useEffect, useCallback, useRef } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import AddDepotForm from "../../components/admin/depot/AddDepotForm";
import DepotDetailsModal from "../../components/admin/depot/DepotDetailsModal";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import {
  getSortIcon,
  handleSort,
  handleDelete,
} from "../../utils/commonUtils";
import { useTableDragScroll } from "../../hooks/useTableDragScroll";

function Depot() {
  const [cookies] = useCookies(["token"]);
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newDepot, setNewDepot] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const dataPerPage = 10;
  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handleLoadData = useCallback(
    async (page = currentPage) => {
      try {
        let url = `/api/management/admin/depot`;
        let params = new URLSearchParams();
        params.append("pageSize", dataPerPage);
        params.append("order_by", orderBy);
        params.append("sort_by", sortBy);
        params.append("page", page);

        if (searchTerm) {
          params.append(searchType, searchTerm);
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
    [cookies.token, currentPage, dataPerPage, orderBy, searchTerm, searchType, sortBy]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDepot((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let response = await fetch(`/api/management/admin/depot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(newDepot),
      });
      if (response.status === 200) {
        toast.success("Depot successfully added.");
        setShowModal(false);
        handleLoadData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add depot");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleSaveDepot = async () => {
    try {
      let response = await fetch(
        `/api/management/admin/depot/${selectedDepot.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify(selectedDepot),
        }
      );
      if (response.status === 200) {
        toast.success("Depot successfully updated.");
        setEditing(false);
        handleLoadData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update depot information");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleShowDetail = (item) => {
    setSelectedDepot(item);
    setShowDetailModal(true);
  };

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
    // handleLoadData(selectedPage + 1);
  };

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  // useEffect(() => {
  //   handleLoadData();
  // }, [currentPage, searchType, searchTerm, orderBy, sortBy, handleLoadData]);

  const renderTableHeader = () => (
    <tr>
      {[
        { label: "ID", key: "id" },
        { label: "Name", key: "name" },
        { label: "Phone", key: null },
        { label: "Address", key: "address" },
        { label: "Status", key: "status" },
        { label: "Operation", key: null },
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
          {item.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.phone}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.address}
        </td>
        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              item.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
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
                  `/api/management/admin/depot`,
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
        {!showDetailModal ? (
          <>
            <div className="mb-4 flex justify-between">
              <div className="flex-grow flex items-center">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                >
                  <option value="name">Name</option>
                  <option value="address">Address</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${searchType}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button
                  onClick={() => setShowModal(true)}
                  className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
            </div>
            {showModal && (
              <AddDepotForm
                showModal={showModal}
                setShowModal={setShowModal}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
              />
            )}
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
          <DepotDetailsModal
            showDetailModal={showDetailModal}
            setShowDetailModal={setShowDetailModal}
            selectedDepot={selectedDepot}
            editing={editing}
            setEditing={setEditing}
            setSelectedDepot={setSelectedDepot}
            handleSaveDepot={handleSaveDepot}
          />
        )}
      </div>
    </div>
  );
}

export default Depot;