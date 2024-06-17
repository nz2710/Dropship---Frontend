import { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPartnerForm from "../components/partner/AddPartnerForm";
import PartnerDetailForm from "../components/partner/PartnerDetailForm";

function PartnerPage() {
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  // const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [orderPageCount, setOrderPageCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedPartnerOrders, setSelectedPartnerOrders] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const dataPerPage = 10;
  const [cookies] = useCookies(["token"]);

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
    handleLoadData(selectedPage + 1);
  };

  const handleDelete = async (item) => {
    try {
      const response = await fetch(`${API_URL2}/api/admin/partner/${item.id}`, {
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

  const handleLoadData = useCallback(
    async (page = currentPage) => {
      const url = new URL(`${API_URL2}/api/admin/partner`);
      url.searchParams.append("pageSize", dataPerPage);
      url.searchParams.append("order_by", orderBy);
      url.searchParams.append("sort_by", sortBy);
      url.searchParams.append("page", page);

      if (searchType === "name") {
        url.searchParams.append("name", searchTerm);
      } else if (searchType === "address") {
        url.searchParams.append("address", searchTerm);
      } else if (searchType === "phone") {
        url.searchParams.append("phone", searchTerm);
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

  const handleAddPartner = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handlePartnerAdded = () => {
    handleLoadData(currentPage);
  };

  const handleShowDetail = async (item) => {
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/partner/${item.id}?page=1&pageSize=5`,
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
        setSelectedPartner(data.data.partner);
        setSelectedPartnerOrders(data.data.orders);
        setCurrentOrderPage(data.current_page);
        setOrderPageCount(data.last_page);
        setShowDetailForm(true);
      } else {
        throw new Error("Failed to fetch partner details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleOrderPageChange = async (selectedPage) => {
    const currentPage = selectedPage.selected + 1;
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/partner/${selectedPartner.id}?page=${currentPage}&pageSize=5`,
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
        setSelectedPartnerOrders(data.data.orders);
        setCurrentOrderPage(data.current_page);
      } else {
        throw new Error("Failed to fetch partner orders");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleCloseDetailForm = () => {
    setSelectedPartner(null);
    setShowDetailForm(false);
  };

  const handlePartnerUpdated = async (updatedPartner) => {
    try {
      setSelectedPartner(updatedPartner);
      const response = await fetch(
        `${API_URL2}/api/admin/partner/${updatedPartner.id}?page=${currentOrderPage}&pageSize=5`,
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
        setSelectedPartnerOrders(data.data.orders);
        setOrderPageCount(data.last_page);
        handleLoadData(currentPage); // Tải lại dữ liệu partner cho bảng danh sách
      } else {
        throw new Error("Failed to fetch updated partner orders");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
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

  useEffect(() => {
    handleLoadData();
  }, [currentPage, searchType, searchTerm, orderBy, sortBy, handleLoadData]);

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
                  className="border border-gray-300 p-2 rounded-md mr-2"
                >
                  <option value="name">Name</option>
                  <option value="address">Address</option>
                  <option value="phone">Phone</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${
                    searchType === "name"
                      ? "Name"
                      : searchType === "address"
                      ? "Address"
                      : "Phone"
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <button
                  onClick={handleAddPartner}
                  className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
              {/* ... */}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed">
                <thead>
                  <tr>
                    <th
                      className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                        "id"
                      )}`}
                      onClick={() => handleSort("id")}
                    >
                      ID
                    </th>
                    <th
                      className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                        "name"
                      )}`}
                      onClick={() => handleSort("name")}
                    >
                      Name
                    </th>
                    {/* <th className="border px-4 py-2">Ngày đăng ký</th> */}
                    <th
                      className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                        "address"
                      )}`}
                      onClick={() => handleSort("address")}
                    >
                      Address
                    </th>
                    <th className="border px-4 py-2 ">Phone</th>
                    <th
                      className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                        "number_of_order"
                      )}`}
                      onClick={() => handleSort("number_of_order")}
                    >
                      Quantity
                    </th>
                    {/* <th className="border px-4 py-2">Chiết khấu</th> */}
                    <th
                      className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                        "revenue"
                      )}`}
                      onClick={() => handleSort("revenue")}
                    >
                      Revenue (VND)
                    </th>
                    <th
                      className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                        "commission"
                      )}`}
                      onClick={() => handleSort("commission")}
                    >
                      Commission (VND)
                    </th>
                    <th
                      className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                        "status"
                      )}`}
                      onClick={() => handleSort("status")}
                    >
                      Status
                    </th>
                    <th className="border px-4 py-2">Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((item) => (
                    <tr key={item.id}>
                      <td className="border px-4 py-2">{item.id}</td>
                      <td className="border px-4 py-2">{item.name}</td>
                      {/* <td className="border px-4 py-2">{item.register_date}</td> */}
                      <td className="border px-4 py-2">{item.address}</td>
                      <td className="border px-4 py-2">{item.phone}</td>
                      <td className="border px-4 py-2">
                        {item.number_of_order}
                      </td>
                      {/* <td className="border px-4 py-2">{item.discount}</td> */}
                      <td className="border px-4 py-2">
                        {item.revenue
                          ? parseFloat(item.revenue).toLocaleString("en-US", {
                              maximumSignificantDigits: 20,
                            })
                          : ""}
                      </td>
                      <td className="border px-4 py-2">
                        {item.commission
                          ? parseFloat(item.commission).toLocaleString(
                              "en-US",
                              {
                                maximumSignificantDigits: 20,
                              }
                            )
                          : ""}
                      </td>
                      <td className="border px-4 py-2">
                        {item.status === "Active" ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          <span className="text-red-500">Inactive</span>
                        )}
                      </td>
                      <td className="border px-1 py-2">
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
            </div>
            {pageCount > 0 && (
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
            )}
          </>
        ) : showAddForm ? (
          <AddPartnerForm
            onClose={handleCloseAddForm}
            onPartnerAdded={handlePartnerAdded}
          />
        ) : (
          <PartnerDetailForm
            partner={selectedPartner}
            orders={selectedPartnerOrders}
            currentPage={currentOrderPage}
            pageCount={orderPageCount}
            onClose={handleCloseDetailForm}
            onPartnerUpdated={handlePartnerUpdated}
            onPageChange={handleOrderPageChange}
          />
        )}
      </div>
    </div>
  );
}
export default PartnerPage;
