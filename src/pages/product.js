import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProductForm from "../components/product/AddProductForm";
import ProductDetailForm from "../components/product/ProductDetailForm";

function Product() {
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const dataPerPage = 10;
  const [cookies] = useCookies(["token"]);

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
    handleLoadData(selectedPage + 1);
  };

  const handleLoadData = async (page = currentPage) => {
    const url = new URL(`${API_URL2}/admin/product`);
    url.searchParams.append("pageSize", dataPerPage);
    url.searchParams.append("order_by", orderBy);
    url.searchParams.append("sort_by", sortBy);
    url.searchParams.append("page", page);

    if (searchType === "name") {
      url.searchParams.append("name", searchTerm);
    } else if (searchType === "sku") {
      url.searchParams.append("sku", searchTerm);
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

  useEffect(() => {
    handleLoadData();
  }, [currentPage, searchType, searchTerm, orderBy, sortBy]);

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleProductAdded = () => {
    handleLoadData(currentPage);
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
      const response = await fetch(`${API_URL2}/admin/product/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      if (response.status === 200) {
        toast.success("Product successfully deleted.");
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
      const response = await fetch(`${API_URL2}/admin/product/${item.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setSelectedProduct(data.data);
        setShowDetailForm(true);
      } else {
        throw new Error("Failed to fetch product details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleCloseDetailForm = () => {
    setSelectedProduct(null);
    setShowDetailForm(false);
  };

  const handleProductUpdated = async (updatedProduct) => {
    try {
      const response = await fetch(
        `${API_URL2}/admin/product/${updatedProduct.id}`,
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
        setSelectedProduct(data.data);
      } else {
        throw new Error("Failed to fetch updated product details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
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
                  <option value="sku">SKU</option>
                  {/* <option value="phone">Phone</option> */}
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${
                    searchType === "name" ? "Name" : "SKU"
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <button
                  onClick={handleAddProduct}
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
                  <th className="border px-4 py-2">SKU</th>
                  <th className="border px-4 py-2 ">Description</th>
                  <th
                    className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                      "price"
                    )}`}
                    onClick={() => handleSort("price")}
                  >
                    Price
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                      "cost"
                    )}`}
                    onClick={() => handleSort("cost")}
                  >
                    Cost
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                      "quantity"
                    )}`}
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity
                  </th>
                  <th className="border px-4 py-2 ">Image</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Operation</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.sku}</td>
                    <td className="border px-4 py-2">{item.description}</td>
                    <td className="border px-4 py-2">{item.price}</td>
                    <td className="border px-4 py-2">{item.cost}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">
                      <img
                        src={`http://localhost:82/images/products/${item.image}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      {item.status === "active" ? (
                        <span className="text-green-500">Active</span>
                      ) : (
                        <span className="text-red-500">Inactive</span>
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
          <AddProductForm
            onClose={handleCloseAddForm}
            onProductAdded={handleProductAdded}
          />
        ) : (
          <ProductDetailForm
            product={selectedProduct}
            onClose={handleCloseDetailForm}
            onProductUpdated={handleProductUpdated}
          />
        )}
      </div>
    </div>
  );
}
export default Product;
