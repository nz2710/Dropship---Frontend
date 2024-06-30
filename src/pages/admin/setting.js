import React, { useState, useEffect, useCallback, useRef } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { getSortIcon, handleSort, formatNumber } from "../../utils/commonUtils";
import { useTableDragScroll } from "../../hooks/useTableDragScroll";

const steps = [
  "Select Depots",
  "Select Vehicle",
  "Select Orders",
  "Configure Limits",
];

function Settings() {
  const [currentStep, setCurrentStep] = useState(0);
  const [depotIds, setDepotIds] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [orderIds, setOrderIds] = useState([]);
  const [isTimeLimitEnabled, setIsTimeLimitEnabled] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [isVehicleLimitEnabled, setIsVehicleLimitEnabled] = useState(false);
  const [vehicleLimit, setVehicleLimit] = useState("");
  const [selectAllDepots, setSelectAllDepots] = useState(false);
  const [selectAllOrders, setSelectAllOrders] = useState(false);
  const [depots, setDepots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [depotPage, setDepotPage] = useState(1);
  const [vehiclePage, setVehiclePage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [depotTotalPages, setDepotTotalPages] = useState(1);
  const [vehicleTotalPages, setVehicleTotalPages] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(["token"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleLimitError, setVehicleLimitError] = useState("");

  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const fetchDepots = useCallback(
    async (page = 1) => {
      try {
        const url = new URL(`${API_URL2}/api/admin/depot`);
        url.searchParams.append("pageSize", 10);
        url.searchParams.append("order_by", orderBy);
        url.searchParams.append("sort_by", sortBy);
        url.searchParams.append("page", page);
        url.searchParams.append("status", "Active");
        if (searchTerm) url.searchParams.append("name", searchTerm);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDepots(data.data.data);
          setDepotTotalPages(data.data.last_page);
        } else {
          throw new Error("Failed to fetch depots");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    },
    [cookies.token, orderBy, sortBy, searchTerm]
  );

  const fetchVehicles = useCallback(
    async (page = 1) => {
      try {
        const url = new URL(`${API_URL2}/api/admin/vehicle`);
        url.searchParams.append("pageSize", 10);
        url.searchParams.append("order_by", orderBy);
        url.searchParams.append("sort_by", sortBy);
        url.searchParams.append("page", page);
        if (searchTerm) url.searchParams.append("name", searchTerm);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVehicles(data.data.data);
          setVehicleTotalPages(data.data.last_page);
        } else {
          throw new Error("Failed to fetch vehicles");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    },
    [cookies.token, orderBy, sortBy, searchTerm]
  );

  const fetchOrders = useCallback(
    async (page = 1) => {
      try {
        const url = new URL(`${API_URL2}/api/admin/order`);
        url.searchParams.append("pageSize", 10);
        url.searchParams.append("order_by", orderBy);
        url.searchParams.append("sort_by", sortBy);
        url.searchParams.append("page", page);
        url.searchParams.append("status", "Pending");
        if (searchTerm) url.searchParams.append("customer_name", searchTerm);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.data.data);
          setOrderTotalPages(data.data.last_page);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    },
    [cookies.token, orderBy, sortBy, searchTerm]
  );

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      setIsLoading(true);

      const data = {
        time_limit: isTimeLimitEnabled ? parseInt(timeLimit) : null,
        num_vehicles: isVehicleLimitEnabled ? parseInt(vehicleLimit) : null,
        vehicle_id: parseInt(vehicleId),
        select_all_orders: selectAllOrders,
        select_all_depots: selectAllDepots,
      };

      if (!selectAllOrders) {
        data.order_ids = orderIds;
      }

      if (!selectAllDepots) {
        data.depot_ids = depotIds;
      }

      const response = await fetch(
        `${API_URL2}/api/admin/routing/generateFile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      setIsLoading(false);

      if (response.ok) {
        // const result = await response.json();
        toast.success("Settings successfully saved.");
        // Redirect or handle success as needed
        setTimeout(() => {
          window.location.href = "/plan";
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Error: " + error.message);
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !selectAllDepots && depotIds.length === 0) {
      toast.error("Please select at least one depot or select all depots.");
      return;
    }
    if (currentStep === 1 && !vehicleId) {
      toast.error("Please select a vehicle.");
      return;
    }
    if (currentStep === 2 && !selectAllOrders && orderIds.length === 0) {
      toast.error("Please select at least one order or select all orders.");
      return;
    }
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const isFormValid = () => {
    if (!vehicleId) {
      toast.error("Please select a vehicle.");
      return false;
    }
    if (!selectAllDepots && depotIds.length === 0) {
      toast.error("Please select at least one depot or select all depots.");
      return false;
    }
    if (!selectAllOrders && orderIds.length === 0) {
      toast.error("Please select at least one order or select all orders.");
      return false;
    }
    return true;
  };

  const handleVehicleSelect = (vehicle) => {
    setVehicleId(vehicle.id);
    setSelectedVehicle(vehicle);
    // Reset vehicle limit if it's higher than the new vehicle's total
    if (vehicleLimit > vehicle.total_vehicles) {
      setVehicleLimit(vehicle.total_vehicles.toString());
    }
  };

  const handleVehicleLimitChange = (e) => {
    const value = e.target.value;
    setVehicleLimit(value);
    if (selectedVehicle && parseInt(value) > selectedVehicle.total_vehicles) {
      setVehicleLimitError(
        `Maximum allowed: ${selectedVehicle.total_vehicles}`
      );
    } else {
      setVehicleLimitError("");
    }
  };

  const renderDepotTable = () => (
    <div>
      <div className="mb-4 flex justify-between">
        <div className="flex-grow flex items-center">
          <input
            type="text"
            placeholder="Search by depot name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="selectAllDepots"
            checked={selectAllDepots}
            onChange={() => setSelectAllDepots(!selectAllDepots)}
            className="mr-2"
          />
          <label htmlFor="selectAllDepots">Select all depots</label>
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
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              {["ID", "Name", "Address"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() =>
                    handleSort(
                      header.toLowerCase(),
                      orderBy,
                      sortBy,
                      setOrderBy,
                      setSortBy
                    )
                  }
                >
                  {header}
                  {getSortIcon(header.toLowerCase(), orderBy, sortBy)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {depots.map((depot) => (
              <tr key={depot.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={depotIds.includes(depot.id)}
                    onChange={() => {
                      setDepotIds((prev) =>
                        prev.includes(depot.id)
                          ? prev.filter((id) => id !== depot.id)
                          : [...prev, depot.id]
                      );
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{depot.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{depot.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{depot.address}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap">{depot.phone}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={depotTotalPages}
        onPageChange={({ selected }) => setDepotPage(selected + 1)}
        containerClassName={"flex justify-center items-center space-x-2 mt-4"}
        pageClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        previousClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        nextClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        activeClassName={"!bg-blue-500 text-white"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );

  const renderVehicleTable = () => (
    <div>
      <div className="mb-4 flex justify-between">
        <div className="flex-grow flex items-center">
          <input
            type="text"
            placeholder="Search by vehicle name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
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
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              {[
                "ID",
                "Name",
                "Total Vehicles",
                "Capacity (kg)",
                "Speed (km/h)",
              ].map((header, index) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() =>
                    handleSort(
                      header.toLowerCase().replace(/ /g, "_"),
                      orderBy,
                      sortBy,
                      setOrderBy,
                      setSortBy
                    )
                  }
                >
                  {header}
                  {getSortIcon(
                    header.toLowerCase().replace(/ /g, "_"),
                    orderBy,
                    sortBy
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="radio"
                    name="vehicle"
                    checked={vehicleId === vehicle.id}
                    onChange={() => handleVehicleSelect(vehicle)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vehicle.total_vehicles}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatNumber(vehicle.capacity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatNumber(vehicle.speed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={vehicleTotalPages}
        onPageChange={({ selected }) => setVehiclePage(selected + 1)}
        containerClassName={"flex justify-center items-center space-x-2 mt-4"}
        pageClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        previousClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        nextClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        activeClassName={"!bg-blue-500 text-white"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );

  const renderOrderTable = () => (
    <div>
      <div className="mb-4 flex justify-between">
        <div className="flex-grow flex items-center">
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="selectAllOrders"
            checked={selectAllOrders}
            onChange={() => setSelectAllOrders(!selectAllOrders)}
            className="mr-2"
          />
          <label htmlFor="selectAllOrders">Select all orders</label>
        </div>
      </div>
      <div
        className="overflow-x-auto cursor-grab active:cursor-grabbing"
        ref={tableRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseMove}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              {[
                "ID",
                "Order Code",
                "Customer Name",
                "Address",
                "Price (VND)",
                "Weight (kg)",
                "Service Time (min)",
              ].map((header, index) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() =>
                    handleSort(
                      header.toLowerCase().replace(/ /g, "_"),
                      orderBy,
                      sortBy,
                      setOrderBy,
                      setSortBy
                    )
                  }
                >
                  {header}
                  {getSortIcon(
                    header.toLowerCase().replace(/ /g, "_"),
                    orderBy,
                    sortBy
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={orderIds.includes(order.id)}
                    onChange={() => {
                      setOrderIds((prev) =>
                        prev.includes(order.id)
                          ? prev.filter((id) => id !== order.id)
                          : [...prev, order.id]
                      );
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.code_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.customer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatNumber(order.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatNumber(order.mass_of_order)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.time_service}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={orderTotalPages}
        onPageChange={({ selected }) => setOrderPage(selected + 1)}
        containerClassName={"flex justify-center items-center space-x-2 mt-4"}
        pageClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        previousClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        nextClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
        activeClassName={"!bg-blue-500 text-white"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );

  const renderLimitSettings = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Configure Limits</h2>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="timeLimitEnabled"
            checked={isTimeLimitEnabled}
            onChange={() => setIsTimeLimitEnabled(!isTimeLimitEnabled)}
          />
          <label htmlFor="timeLimitEnabled">Enable Time Limit</label>
        </div>
        {isTimeLimitEnabled && (
          <input
            type="number"
            placeholder="Time limit (minutes)"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="vehicleLimitEnabled"
            checked={isVehicleLimitEnabled}
            onChange={() => {
              setIsVehicleLimitEnabled(!isVehicleLimitEnabled);
              setVehicleLimitError("");
            }}
          />
          <label htmlFor="vehicleLimitEnabled">Enable Vehicle Limit</label>
        </div>
        {isVehicleLimitEnabled && (
          <div>
            <input
              type="number"
              placeholder="Maximum number of vehicles"
              value={vehicleLimit}
              onChange={handleVehicleLimitChange}
              className={`w-full p-2 border rounded ${
                vehicleLimitError ? "border-red-500" : "border-gray-300"
              }`}
              min="1"
              max={selectedVehicle ? selectedVehicle.total_vehicles : undefined}
            />
            {vehicleLimitError && (
              <p className="text-red-500 text-sm mt-1">{vehicleLimitError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderDepotTable();
      case 1:
        return renderVehicleTable();
      case 2:
        return renderOrderTable();
      case 3:
        return renderLimitSettings();
      default:
        return null;
    }
  };

  useEffect(() => {
    if (currentStep === 0) fetchDepots(depotPage);
    if (currentStep === 1) fetchVehicles(vehiclePage);
    if (currentStep === 2) fetchOrders(orderPage);
  }, [
    currentStep,
    depotPage,
    vehiclePage,
    orderPage,
    fetchDepots,
    fetchVehicles,
    fetchOrders,
  ]);

  return (
    <div className="container mx-auto py-8 px-4">
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

      <h1 className="text-2xl font-bold mb-6">Algorithm Configuration</h1>

      <div className="mb-8">
        <div className="flex mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div
                className={`flex-1 text-center ${
                  index <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-grow border-t-2 ${
                    index < currentStep ? "border-blue-600" : "border-gray-400"
                  } my-auto`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <form>
        {renderStepContent()}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Settings;
