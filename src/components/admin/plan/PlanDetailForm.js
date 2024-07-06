import React, { useRef } from "react";
import ReactPaginate from "react-paginate";
import { useCookies } from "react-cookie";
import { formatNumber } from "../../../utils/commonUtils";
import { useTableDragScroll } from "../../../hooks/useTableDragScroll";

function PlanDetailForm({
  plan,
  routes,
  currentPage,
  pageCount,
  onClose,
  onPageChange,
}) {
  const [cookies] = useCookies(["token"]);
  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handleViewDetails = (routeId) => {
    const token = cookies.token;
    const newUrl = `/admin/route/${routeId}?token=${token}`;
    window.open(newUrl, "_blank");
  };

  const renderInfoItem = (label, value) => (
    <div className="mb-2">
      <span className="font-semibold">{label}:</span> {value}
    </div>
  );

  const getStatusBadge = (status) => {
    const colors = {
      Success: "bg-green-100 text-green-800",
      Delivery: "bg-blue-100 text-blue-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[status] || colors.Pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Plan Details</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          {renderInfoItem("Name", plan.name)}
          {renderInfoItem(
            "Total Distance",
            `${formatNumber(plan.total_distance)} km`
          )}
          {renderInfoItem(
            "Total Time",
            `${formatNumber(plan.total_time_serving)} minutes`
          )}
          {renderInfoItem(
            "Total Demand",
            `${formatNumber(plan.total_demand)} kg`
          )}
          {renderInfoItem("Customers Served", plan.total_num_customer_served)}
          {renderInfoItem(
            "Customers Unserved",
            plan.total_num_customer_not_served
          )}
          {renderInfoItem("Total Vehicles", plan.total_vehicle_used)}
          {/* {renderInfoItem("Total Routes", plan.total_routes)} */}
          {renderInfoItem("Status", getStatusBadge(plan.status))}
          {renderInfoItem(
            "Expected Date",
            new Date(plan.expected_date).toLocaleString()
          )}
          {renderInfoItem(
            "Created at",
            new Date(plan.created_at).toLocaleString()
          )}
        </div>
        <div>
          {/* {renderInfoItem("Total Unallocated Distance", `${formatNumber(plan.total_distance_without_allocating_vehicles)} km`)}
          {renderInfoItem("Total Unallocated Time", `${formatNumber(plan.total_time_serving_without_allocating_vehicles)} minutes`)}
          {renderInfoItem("Total Unallocated Demand", `${formatNumber(plan.total_demand_without_allocating_vehicles)} kg`)} */}

          {renderInfoItem("Fleet", plan.vehicle_name)}
          {renderInfoItem(
            "Moving Cost",
            `${formatNumber(plan.moving_cost)} VND`
          )}
          {renderInfoItem("Labor Cost", `${formatNumber(plan.labor_cost)} VND`)}
          {renderInfoItem("Total Cost", `${formatNumber(plan.fee)} VND`)}
          {renderInfoItem(
            "Shipping Fee",
            `${formatNumber(plan.unloading_cost)} VND`
          )}
          {renderInfoItem(
            "Total Order Value",
            `${formatNumber(plan.total_order_value)} VND`
          )}
          {renderInfoItem(
            "Total Revenue",
            `${formatNumber(plan.total_plan_value)} VND`
          )}
          {renderInfoItem(
            "Total Order Profit",
            `${formatNumber(plan.total_order_profit)} VND`
          )}
          {renderInfoItem("Total Profit", `${formatNumber(plan.profit)} VND`)}
          {renderInfoItem(
            "Efficiency",
            plan.total_plan_value && plan.total_plan_value !== 0
              ? `${(formatNumber(plan.profit / plan.total_plan_value) * 100)}%`
              : "N/A"
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Routes</h3>
        <div className="text-sm font-medium">
          Total Routes: <span className="font-bold">{plan.total_routes}</span>
        </div>
      </div>
      <div
        className="overflow-x-auto mb-6"
        ref={tableRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {[
                "ID",
                "Depot",
                "Demand (kg)",
                "Distance (km)",
                "Time (min)",
                "Cost (VND)",
                "Revenue (VND)",
                "Profit (VND)",
                "Status",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="p-2 text-left text-sm font-semibold text-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((route, index) => (
              <tr
                key={route.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-2">{route.id}</td>
                <td className="p-2">{route.depot_name}</td>
                <td className="p-2">{formatNumber(route.total_demand)}</td>
                <td className="p-2">{formatNumber(route.total_distance)}</td>
                <td className="p-2">
                  {formatNumber(route.total_time_serving)}
                </td>
                <td className="p-2">{formatNumber(route.fee)}</td>
                <td className="p-2">{formatNumber(route.total_route_value)}</td>
                <td className="p-2">{formatNumber(route.profit)}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      route.is_served === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {route.is_served === 1 ? "Served" : "Unserved"}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleViewDetails(route.id)}
                    className="text-blue-600 hover:text-blue-800"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={onPageChange}
          containerClassName={"flex justify-center items-center space-x-2 mt-4"}
          pageClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
          previousClassName={
            "px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          }
          nextClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
          activeClassName={"!bg-blue-500 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          forcePage={currentPage - 1}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
        />
      )}

      <div className="text-right mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PlanDetailForm;
