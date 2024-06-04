import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlanDetailForm from "../components/plan/PlanDetailForm";

function Plan() {
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const dataPerPage = 10;
  const [cookies] = useCookies(["token"]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [currentRoutePage, setCurrentRoutePage] = useState(1);
  const [routePageCount, setRoutePageCount] = useState(0);
  const [selectedPlanRoutes, setSelectedPlanRoutes] = useState(null);

  const handleShowDetail = async (item) => {
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/routing/${item.id}??page=1&pageSize=10`,
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

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
    handleLoadData(selectedPage + 1);
  };

  const handleLoadData = async (page = currentPage) => {
    const url = new URL(`${API_URL2}/api/admin/routing`);
    url.searchParams.append("pageSize", dataPerPage);
    url.searchParams.append("order_by", orderBy);
    url.searchParams.append("sort_by", sortBy);
    url.searchParams.append("page", page);
    url.searchParams.append("name", searchTerm); // Thêm từ khóa tìm kiếm vào URL

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
      const response = await fetch(`${API_URL2}/api/admin/routing/${item.id}`, {
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

  useEffect(() => {
    handleLoadData();
  }, [currentPage, searchTerm, orderBy, sortBy]);

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
            <div className="mb-4 flex">
              <input
                type="text"
                placeholder={`Search by name`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
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
                    className={`border px-4 py-2 cursor-pointer style={{ width: "5%" }} ${getSortIcon(
                      "name"
                    )}`}
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                      "total_distance"
                    )}`}
                    onClick={() => handleSort("total_distance")}
                  >
                    Total Distance (km)
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                      "total_time_serving"
                    )}`}
                    onClick={() => handleSort("total_time_serving")}
                  >
                    Total Time (minutes)
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                      "total_demand"
                    )}`}
                    onClick={() => handleSort("total_demand")}
                  >
                    Total Demand (kg)
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                      "fee"
                    )}`}
                    onClick={() => handleSort("fee")}
                  >
                    Fee (VND)
                  </th>
                  <th
                    className={`border px-4 py-2 cursor-pointer ${getSortIcon(
                      "status"
                    )}`}
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </th>
                  {/* <th className="border px-4 py-2">Kinh độ</th>
              <th className="border px-4 py-2">Vĩ độ</th>
              <th className="border px-4 py-2">Thời gian phục vụ</th> */}
                  <th className="border px-4 py-2">Operation</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">
                      {parseFloat(item.total_distance)}
                    </td>
                    <td className="border px-4 py-2">
                      {parseFloat(item.total_time_serving)}
                    </td>
                    <td className="border px-4 py-2">
                      {parseFloat(item.total_demand)}
                    </td>
                    <td className="border px-4 py-2">
                      {item.fee
                        ? parseFloat(item.fee).toLocaleString("vi-VN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })
                        : ""}
                    </td>
                    <td className="border px-4 py-2">
                      {item.status === "success" ? (
                        <span className="text-green-500">Success</span>
                      ) : item.status === "delivery" ? (
                        <span className="text-yellow-500">Delivery</span>
                      ) : (
                        <span className="text-red-500">Pending</span>
                      )}
                    </td>
                    {/* <td className="border px-4 py-2">{item.col4}</td>
                <td className="border px-4 py-2">{item.col5}</td>
                <td className="border px-4 py-2">{item.col6}</td> */}
                    <td className="border px-2 py-2">
                      <div className="flex gap-1">
                        <button
                          //   onClick={() => handleShowDetail(item)}
                          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-800"
                        >
                          Confirm
                        </button>
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
        ) : (
          <PlanDetailForm
            plan={selectedPlan}
            onClose={handleCloseDetailForm}
            routes={selectedPlanRoutes}
            currentPage={currentRoutePage}
            pageCount={routePageCount}
            onPageChange={handleRoutePageChange}
            // onProductUpdated={handleProductUpdated}
          />
        )}
      </div>
    </div>
  );
}
export default Plan;
