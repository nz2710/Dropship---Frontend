import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getSortIcon,
  handleSort,
  formatNumber,
  handleDelete,
} from "../../utils/commonUtils";
import { useTableDragScroll } from "../../hooks/useTableDragScroll";
import AddMilestoneForm from "../../components/admin/commission/AddMilestoneForm";

function CommissionRules() {
  const [orderBy, setOrderBy] = useState("revenue_milestone");
  const [sortBy, setSortBy] = useState("asc");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const dataPerPage = 10;
  const [cookies] = useCookies(["token"]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  const handleLoadData = useCallback(
    async (page = currentPage) => {
      try {
        let url = `/api/management/admin/rule`;
        let params = new URLSearchParams();
        params.append("pageSize", dataPerPage);
        params.append("order_by", orderBy);
        params.append("sort_by", sortBy);
        params.append("page", page);
        url += '?' + params.toString();
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentPageData(data.data.data);
          setPageCount(data.data.last_page);
        } else {
          throw new Error("Failed to fetch commission rules");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    },
    [currentPage, orderBy, sortBy, cookies.token]
  );

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const handleAddMilestone = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleMilestoneAdded = () => {
    handleLoadData(currentPage);
  };

  const renderTableHeader = () => (
    <tr>
      {[
        { label: "Revenue Milestone", key: "revenue_milestone" },
        { label: "Bonus Amount", key: "bonus_amount" },
        { label: "Actions", key: null },
      ].map((column, index) => (
        <th
          key={column.label}
          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${
            index !== 2 ? "border-r border-gray-200" : ""
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

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingValues({
      revenue_milestone: item.revenue_milestone,
      bonus_amount: item.bonus_amount,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValues({});
  };

  const handleSaveEdit = async () => {
    try {
      let response = await fetch(`/api/management/admin/rule/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify(editingValues),
      });

      if (response.ok) {
        toast.success("Rule updated successfully");
        setEditingId(null);
        setEditingValues({});
        handleLoadData(currentPage);
      } else {
        throw new Error("Failed to update rule");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleInputChange = (e, field) => {
    setEditingValues({
      ...editingValues,
      [field]: e.target.value,
    });
  };

  const renderTableBody = () =>
    currentPageData.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
          {editingId === item.id ? (
            <input
              type="number"
              value={editingValues.revenue_milestone}
              onChange={(e) => handleInputChange(e, "revenue_milestone")}
              className="w-full p-1 border rounded"
            />
          ) : (
            formatNumber(item.revenue_milestone) + " VND"
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {editingId === item.id ? (
            <input
              type="number"
              value={editingValues.bonus_amount}
              onChange={(e) => handleInputChange(e, "bonus_amount")}
              className="w-full p-1 border rounded"
            />
          ) : (
            formatNumber(item.bonus_amount) + " VND"
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            {editingId === item.id ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="text-green-600 hover:text-green-900"
                  title="Save"
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
                <button
                  onClick={handleCancelEdit}
                  className="text-red-600 hover:text-red-900"
                  title="Cancel"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(item)}
                  className="text-yellow-600 hover:text-yellow-900"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    handleDelete(
                      `/api/management/admin/rule`,
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
              </>
            )}
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
        {!showAddForm ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Commission Rules</h2>
              <div>
                <button
                  onClick={handleAddMilestone}
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
          <AddMilestoneForm
            onClose={handleCloseAddForm}
            onMilestoneAdded={handleMilestoneAdded}
          />
        )}
      </div>
    </div>
  );
}

export default CommissionRules;
