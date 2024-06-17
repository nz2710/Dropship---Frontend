import { useState, useEffect, useCallback } from "react";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import AddVehicleForm from "../components/vehicle/AddVehicleForm";
import VehicleDetailForm from "../components/vehicle/VehicleDetailForm";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";


function Vehicle() {
  const [cookies] = useCookies(["token"]);
  // const [searchName, setSearchName] = useState("");
  // const [searchAddress, setSearchAddress] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);

  const dataPerPage = 10;

  const handleLoadData = useCallback(async (page = currentPage) => {
    try {
      const url = new URL(`${API_URL2}/api/admin/vehicle`);
      url.searchParams.append("pageSize", dataPerPage);
      url.searchParams.append("order_by", orderBy);
      url.searchParams.append("sort_by", sortBy);
      url.searchParams.append("page", page);
      url.searchParams.append("name", searchTerm);

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
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      setError(error.message);
    }
  }, [cookies.token, currentPage, dataPerPage, orderBy, searchTerm, sortBy]);

  const handleDelete = async (item) => {
    try {
      const response = await fetch(`${API_URL2}/api/admin/vehicle/${item.id}`, {
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


  const handleVehicleUpdated = async (updatedVehicle) => {
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/vehicle/${updatedVehicle.id}`,
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
        setSelectedVehicle(data.data);
      } else {
        throw new Error("Failed to fetch updated vehicle details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };
  const handleShowDetail = async (item) => {
    try {
      const response = await fetch(`${API_URL2}/api/admin/vehicle/${item.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setSelectedVehicle(data.data);
        setShowDetailForm(true);
      } else {
        throw new Error("Failed to fetch vehicle details");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleAddVehicle = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleVehicleAdded = () => {
    handleLoadData(currentPage);
  };

  const handleCloseDetailForm = () => {
    setSelectedVehicle(null);
    setShowDetailForm(false);
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
  }, [currentPage, searchTerm, orderBy, sortBy, handleLoadData]);

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
      {!showAddForm && !showDetailForm ? (
          <>
        <div className="mb-4 flex justify-between">
          <div className="flex-grow flex items-center">
            <input
              type="text"
              placeholder={`Search by name`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <button
              onClick={handleAddVehicle}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add
            </button>
          </div>
        </div>
        {/* ... */}
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
                  "total_vehicles"
                )}`}
                onClick={() => handleSort("total_vehicles")}
              >
                Total vehicles
              </th>
              <th
                className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                  "capacity"
                )}`}
                onClick={() => handleSort("capacity")}
              >
                Capacity (kg)
              </th>
              <th
                className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                  "speed"
                )}`}
                onClick={() => handleSort("speed")}
              >
                Velocity (km/h)
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
            {currentPageData.map((item, index) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.name}</td>
                {/* <td className="border px-4 py-2">D</td> */}
                {/* <td className="border px-4 py-2">{item.longitude}</td>
                <td className="border px-4 py-2">{item.latitude}</td> */}
                <td className="border px-4 py-2 ">{item.total_vehicles}</td>
                <td className="border px-4 py-2 ">{item.capacity}</td>
                <td className="border px-4 py-2 ">{item.speed}</td>
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
          <AddVehicleForm
            onClose={handleCloseAddForm}
            onVehicleAdded={handleVehicleAdded}
          />
        ) : (
          <VehicleDetailForm
          vehicle={selectedVehicle}
          onClose={handleCloseDetailForm}
          onVehicleUpdated={handleVehicleUpdated}
          />
        )}
      </div>
    </div>
  );
}

export default Vehicle;
