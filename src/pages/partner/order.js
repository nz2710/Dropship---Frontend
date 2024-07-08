import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddOrderForm from "../../components/partner/order/AddOrderForm";
import OrderDetailForm from "../../components/partner/order/OrderDetailForm";
import { getSortIcon, handleSort, formatNumber } from "../../utils/commonUtils";
import { useTableDragScroll } from "../../hooks/useTableDragScroll";

function OrderPage() {
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [productPageCount, setProductPageCount] = useState(0);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const dataPerPage = 10;
  const [cookies] = useCookies(["token"]);
  const [showAddForm, setShowAddForm] = useState(false);

  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handleAddOrder = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleOrderAdded = () => {
    handleLoadData(currentPage);
  };

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
    // handleLoadData(selectedPage + 1);
  };

  const handleLoadData = useCallback(
    async (page = currentPage) => {
      try {
        let url = `/api/management/partner/orders`;
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
          console.log(body);
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

  const handleCancelOrder = async (orderId) => {
    try {
      let response = await fetch(
        `/api/management/partner/orders/${orderId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );

      if (response.ok) {
        toast.success("Order cancelled successfully");
        handleLoadData(currentPage);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleShowDetail = async (item) => {
    try {
      let response = await fetch(
        `/api/management/partner/orders/${item.id}?page=1&pageSize=5`,
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
        const data = await response.json();
        setSelectedOrder(data.data.order);
        setSelectedOrderProducts(data.data.products);
        setCurrentProductPage(data.current_page);
        setProductPageCount(data.last_page);
        setShowDetailForm(true);
      } else {
        throw new Error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleProductPageChange = async (selectedPage) => {
    const currentPage = selectedPage.selected + 1;
    try {
      let response = await fetch(
        `/api/management/partner/orders/${selectedOrder.id}?page=${currentPage}&pageSize=5`,
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
        const data = await response.json();
        setSelectedOrderProducts(data.data.products);
        setCurrentProductPage(data.current_page);
      } else {
        throw new Error("Failed to fetch order products");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleCloseDetailForm = () => {
    setSelectedOrder(null);
    setShowDetailForm(false);
  };

  const refreshOrderData = useCallback(
    async (orderId) => {
      try {
        let response = await fetch(
          `/api/management/partner/orders/${orderId}?page=1&pageSize=5`,
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
          const data = await response.json();
          setSelectedOrder(data.data.order);
          setSelectedOrderProducts(data.data.products);
          setCurrentProductPage(data.current_page);
          setProductPageCount(data.last_page);
        } else {
          throw new Error("Failed to fetch updated order details");
        }
      } catch (error) {
        toast.error("Error refreshing order data: " + error.message);
      }
    },
    [cookies.token]
  );

  const handleOrderUpdated = useCallback(
    (updatedOrder) => {
      setSelectedOrder(updatedOrder);
      setCurrentPageData((prevData) =>
        prevData.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      setSelectedOrderProducts(updatedOrder.products);
      toast.success("Order updated successfully");
      refreshOrderData(updatedOrder.id);
      handleLoadData(currentPage);
    },
    [currentPage, handleLoadData, refreshOrderData]
  );

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let response = await fetch(`/api/management/partner/getProducts`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        if (response.status === 200) {
          const body = await response.json();
          setAllProducts(body.data);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    };
    fetchAllProducts();
  }, [cookies.token]);

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const renderTableHeader = () => (
    <tr>
      {[
        { label: "ID", key: "id" },
        // { label: "Partner", key: null },
        { label: "Code Order", key: null },
        { label: "Customer", key: "customer_name" },
        { label: "Address", key: null },
        { label: "Price (VND)", key: "price" },
        { label: "Weight (kg)", key: "mass_of_order" },
        { label: "Time Service (minutes)", key: "time_service" },
        { label: "Status", key: "status" },
        { label: "Operation", key: null },
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
        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.partner?.name ?? "No Partner"}
        </td> */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.code_order}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.customer_name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.address}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.price)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {formatNumber(item.mass_of_order)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
          {item.time_service}
        </td>
        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              item.status === "Success"
                ? "bg-green-100 text-green-800"
                : item.status === "Delivery"
                ? "bg-blue-100 text-blue-800"
                : item.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : item.status === "Waiting"
                ? "bg-purple-100 text-purple-800"
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
            {item.status !== "Success" && item.status !== "Cancelled" && (
              <button
                onClick={() => handleCancelOrder(item.id)}
                className="text-orange-600 hover:text-orange-900"
                title="Cancel Order"
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
        {!showAddForm && !showDetailForm ? (
          <>
            <div className="mb-4 flex justify-between">
              <div className="flex-grow flex items-center">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                >
                  <option value="customer_name">Customer Name</option>
                  <option value="code_order">Code Order</option>
                  <option value="partner_name">Partner Name</option>
                  <option value="address">Address</option>
                  <option value="phone">Phone</option>
                  <option value="status">Status</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${searchType.replace("_", " ")}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button
                  onClick={handleAddOrder}
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
        ) : showAddForm ? (
          <AddOrderForm
            onClose={handleCloseAddForm}
            onOrderAdded={handleOrderAdded}
          />
        ) : (
          <OrderDetailForm
            order={selectedOrder}
            products={selectedOrderProducts}
            currentPage={currentProductPage}
            pageCount={productPageCount}
            onClose={handleCloseDetailForm}
            onPageChange={handleProductPageChange}
            onOrderUpdated={handleOrderUpdated}
            allProducts={allProducts} // Nếu bạn có danh sách tất cả sản phẩm
          />
        )}
      </div>
    </div>
  );
}

export default OrderPage;
