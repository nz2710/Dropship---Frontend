import { useState, useEffect } from "react";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import AddDepotForm from "../components/depot/AddDepotForm";
import DepotDetailsModal from "../components/depot/DepotDetailsModal";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

function Depot() {
  const [cookies] = useCookies(["token"]);
  // const [searchName, setSearchName] = useState("");
  // const [searchAddress, setSearchAddress] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newDepot, setNewDepot] = useState({
    name: "",
    address: "",
  });

  const dataPerPage = 10;

  const handleLoadData = async (page = currentPage) => {
    try {
      const url = new URL(`${API_URL2}/admin/depot`);
      url.searchParams.append("pageSize", dataPerPage);
      url.searchParams.append("order_by", orderBy);
      url.searchParams.append("sort_by", sortBy);
      url.searchParams.append("page", page);

      if (searchType === "name") {
        url.searchParams.append("name", searchTerm);
      } else if (searchType === "address") {
        url.searchParams.append("address", searchTerm);
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
        // console.log(body);
        setCurrentPageData(body.data);
        setPageCount(body.last_page);
        if (body.data.length === 0 && page > 1) {
          setCurrentPage(page - 1);
        } else {
          setCurrentPage(page);
        }
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (item) => {
    try {
      const response = await fetch(`${API_URL2}/admin/depot/${item.id}`, {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDepot((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL2}/admin/depot`, {
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
        throw new Error("Failed to add depot");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleSaveDepot = async () => {
    try {
      const response = await fetch(
        `${API_URL2}/admin/depot/${selectedDepot.id}`,
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
        throw new Error("Failed to update depot");
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
    handleLoadData(selectedPage + 1);
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
  }, [currentPage, searchType, searchTerm, orderBy, sortBy]);

  // useEffect(() => {
  //   const addressInput = document.getElementById("address-input");
  //   if (addressInput) {
  //     const geocoder = new MapboxGeocoder({
  //       accessToken: accessToken,
  //       types: "address",
  //       placeholder: "Enter address",
  //     });
  //     geocoder.addTo(addressInput);
  //     geocoder.on("result", (e) => {
  //       const selectedAddress = e.result.place_name;
  //       setNewDepot((prev) => ({ ...prev, address: selectedAddress }));
  //     });
  //   }
  // }, [showModal]);

  if (error) return <div>Error: {error}</div>;

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
        <div className="mb-4 flex justify-between">
          <div className="flex-grow flex items-center">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mr-2"
            >
              <option value="name">Name</option>
              <option value="address">Address</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${
                searchType === "name" ? "Name" : "Address"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
            {/* <input
              type="text"
              placeholder="Search by date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            /> */}
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
        {/* ... */}
        {showModal && (
          <AddDepotForm
            showModal={showModal}
            setShowModal={setShowModal}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          />
        )}
        {/* ... */}
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
              {/* <th
                className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                  "id"
                )}`}
                onClick={() => handleSort("id")}
              >
                Code
              </th> */}
              {/* <th className="border px-4 py-2">Kinh độ</th>
              <th className="border px-4 py-2">Vĩ độ</th> */}
              <th
                className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                  "address"
                )}`}
                onClick={() => handleSort("address")}
              >
                Address
              </th>
              <th
                className={`border px-4 py-2 w-1/4 cursor-pointer ${getSortIcon(
                  "status"
                )}`}
                onClick={() => handleSort("status")}
              >
                Status
              </th>
              <th className="border px-4 py-2 w-1/8">Operation</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, index) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.name}</td>
                {/* <td className="border px-4 py-2">D</td> */}
                {/* <td className="border px-4 py-2">{item.longitude}</td>
                <td className="border px-4 py-2">{item.latitude}</td> */}
                <td className="border px-4 py-2 ">{item.address}</td>
                <td className="border px-4 py-2">
                  {item.status === "1" ? (
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
        {/* ... */}
        {showDetailModal && (
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
        {/* ... */}
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
      </div>
    </div>
  );
}

export default Depot;
