import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddOrderForm from "../components/order/AddOrderForm";
import OrderDetailForm from "../components/order/OrderDetailForm";

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
  const dataPerPage = 10;
  const [cookies] = useCookies(["token"]);

  const [showAddForm, setShowAddForm] = useState(false);

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
    handleLoadData(selectedPage + 1);
  };

  const handleLoadData = async (page = currentPage) => {
    const url = new URL(`${API_URL2}/api/admin/order`);
    url.searchParams.append("pageSize", dataPerPage);
    url.searchParams.append("order_by", orderBy);
    url.searchParams.append("sort_by", sortBy);
    url.searchParams.append("page", page);

    if (searchType === "customer_name") {
      url.searchParams.append("customer_name", searchTerm);
    } else if (searchType === "address") {
      url.searchParams.append("address", searchTerm);
    } else if (searchType === "phone") {
      url.searchParams.append("phone", searchTerm);
    } else if (searchType === "partner_name") {
      url.searchParams.append("partner_name", searchTerm);
    } else if (searchType === "status") {
      url.searchParams.append("status", searchTerm);
    }

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
      if (body.data.length === 0 && page > 1) {
        setCurrentPage(page - 1);
      } else {
        setCurrentPage(page);
      }
    } else {
      console.log("Fail", response);
    }
  };

  const handleSort = (column) => {
    if (orderBy === column) {
      setSortBy(sortBy === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(column);
      setSortBy("asc");
    }
  };
  const getSortIcon = (column) => {
    if (orderBy === column) {
      return sortBy === "asc" ? "sort-asc" : "sort-desc";
    }
    return "";
  };

  const handleDelete = async (item) => {
    try {
      const response = await fetch(`${API_URL2}/api/admin/order/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      if (response.status === 200) {
        toast.success("Item successfully deleted.");
        handleLoadData(currentPage);
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleShowDetail = async (item) => {
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/order/${item.id}?page=1&pageSize=5`,
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
        setSelectedOrder(data.data);
        setSelectedOrderProducts(data.data.products);
        setCurrentProductPage(data.current_page);
        setProductPageCount(data.last_page);
        setShowDetailForm(true);
      } else {
        throw new Error("Failed to fetch product details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleProductPageChange = async (selectedPage) => {
    const currentPage = selectedPage.selected + 1;
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/order/${selectedOrder.id}?page=${currentPage}&pageSize=5`,
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
        throw new Error("Failed to fetch partner orders");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleCloseDetailForm = () => {
    setSelectedOrder(null);
    setShowDetailForm(false);
  };

  useEffect(() => {
    handleLoadData();
  }, [currentPage, searchType, searchTerm, orderBy, sortBy]);

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
          // Nội dung hiển thị khi không có form add order
          <>
            {/* ... */}
            <div className="mb-4 flex justify-between">
              <div className="flex-grow flex items-center">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md mr-2"
                >
                  <option value="customer_name">Customer Name</option>
                  <option value="partner_name">Partner Name</option>
                  <option value="address">Address</option>
                  <option value="phone">Phone</option>
                  <option value="status">Status</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${
                    searchType === "name"
                      ? "Name"
                      : searchType === "address"
                      ? "Address"
                      : searchType === "phone"
                      ? "Phone"
                      : searchType === "partner_name"
                      ? "Partner Name"
                      : "Status"
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
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
              {/* ... */}
            </div>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th
                    className={`border px-4 py-2 cursor-pointer style={{ width: "5%" }} ${getSortIcon(
                      "id"
                    )}`}
                    onClick={() => handleSort("id")}
                  >
                    ID
                  </th>
                  <th className="border px-4 py-2" style={{ width: "10%" }}>
                    Partner
                  </th>
                  <th className="border px-4 py-2" style={{ width: "25%" }}>
                    Code Order
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer style={{ width: "10%" }} ${getSortIcon(
                      "customer_name"
                    )}`}
                    onClick={() => handleSort("customer_name")}
                  >
                    Customer
                  </th>
                  {/* <th className="border px-4 py-2" style={{ width: "7%" }}>
                    Phone
                  </th> */}
                  <th className="border px-4 py-2" style={{ width: "30%" }}>
                    Address
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer style={{ width: "5%" }} ${getSortIcon(
                      "price"
                    )}`}
                    onClick={() => handleSort("price")}
                  >
                    Price
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer style={{ width: "5%" }} ${getSortIcon(
                      "mass_of_order"
                    )}`}
                    onClick={() => handleSort("mass_of_order")}
                  >
                    Weight
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer style={{ width: "5%" }} ${getSortIcon(
                      "time_service"
                    )}`}
                    onClick={() => handleSort("time_service")}
                  >
                    Time Service
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer style={{ width: "7%" }} ${getSortIcon(
                      "status"
                    )}`}
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </th>
                  <th className="border px-4 py-2" style={{ width: "7%" }}>
                    Operation
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">
                      {item.partner?.name ?? "No Partner"}
                    </td>
                    <td className="border px-4 py-2">{item.code_order}</td>
                    <td className="border px-4 py-2">{item.customer_name}</td>
                    {/* <td className="border px-4 py-2">{item.phone}</td> */}
                    <td className="border px-4 py-2">{item.address}</td>
                    <td className="border px-4 py-2">
                      {item.price
                        ? parseFloat(item.price).toLocaleString("vi-VN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })
                        : ""}
                    </td>
                    <td className="border px-4 py-2">
                      {parseFloat(item.mass_of_order)}
                    </td>
                    <td className="border px-4 py-2">{item.time_service}</td>
                    <td className="border px-4 py-2">
                      {item.status === "success" ? (
                        <span className="text-green-500">Success</span>
                      ) : item.status === "delivery" ? (
                        <span className="text-yellow-500">Delivery</span>
                      ) : (
                        <span className="text-red-500">Pending</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShowDetail(item)}
                          className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-800"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
              forcePage={currentPage - 1}
            />
          </>
        ) : showAddForm ? (
          <AddOrderForm
            onClose={handleCloseAddForm}
            onOrderAdded={handleOrderAdded}
          />
        ) : (
          <OrderDetailForm
            order={selectedOrder}
            onClose={handleCloseDetailForm}
            products={selectedOrderProducts}
            currentPage={currentProductPage}
            pageCount={productPageCount}
            onPageChange={handleProductPageChange}
            // onProductUpdated={handleProductUpdated}
          />
        )}
      </div>
    </div>
  );
}
export default OrderPage;
