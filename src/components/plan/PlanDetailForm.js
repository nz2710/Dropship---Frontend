import React from "react";
import { useState, useEffect } from "react";
import { API_URL2 } from "../../utils/constant";
// import { useCookies } from "react-cookie";
// import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import RouteDetailForm from "./RouteDetailForm";

function PlanDetailForm({
  plan,
  routes,
  currentPage,
  pageCount,
  onClose,
  onPageChange,
}) {
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const handleViewDetails = (route) => {
    setSelectedRoute(route);
    setShowRouteDetails(true);
  };
  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-3">Plan Details</h2>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Name</label>
          <p>{plan.name}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Status</label>
          <p>
            {/* {" "} */}
            {plan.status === "success" ? (
              <span className="text-green-500">Success</span>
            ) : plan.status === "delivery" ? (
              <span className="text-yellow-500">Delivery</span>
            ) : (
              <span className="text-red-500">Pending</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Total Distance</label>
          <p>{parseFloat(plan.total_distance)}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">
            Total Unallocated Distance
          </label>
          <p>{parseFloat(plan.total_distance_without_allocating_vehicles)}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Total Time</label>
          <p>{parseFloat(plan.total_time_serving)}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Total Unallocated Time</label>
          <p>
            {parseFloat(plan.total_time_serving_without_allocating_vehicles)}
          </p>
          {/* )} */}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Total Demand</label>
          <p>{parseFloat(plan.total_demand)}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">
            Total Unallocated Demand
          </label>
          <p>{parseFloat(plan.total_demand_without_allocating_vehicles)}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Total Fee</label>
          <p>
            {" "}
            {plan.fee
              ? parseFloat(plan.fee).toLocaleString("vi-VN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : ""}
          </p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Total Vehicle</label>
          <p>{plan.total_vehicle_used}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Customer Served</label>
          <p>{plan.total_num_customer_served}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Customer UnServed</label>
          <p>{plan.total_num_customer_not_served}</p>
        </div>
      </div>

      {/* Thêm bảng hiển thị thông tin product ở đây */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Routes</h3>
        <span className="text-gray-600">Total Routes: {plan.total_routes}</span>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Demand</th>
            <th className="border px-4 py-2">Distance</th>
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Depot</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td className="border px-4 py-2">{route.id}</td>
              <td className="border px-4 py-2">
                {parseFloat(route.total_demand)}
              </td>
              <td className="border px-4 py-2">
                {parseFloat(route.total_distance)}
              </td>
              <td className="border px-4 py-2">
                {parseFloat(route.total_time_serving)}
              </td>
              <td className="border px-4 py-2">{route.depot_name}</td>
              <td className="border px-4 py-2">
                {" "}
                {route.is_served === 1 ? (
                  <span className="text-green-500">Served</span>
                ) : (
                  <span className="text-red-500">Unserved</span>
                )}
              </td>
              <td className="border px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(route)}
                    className="bg-blue-500 hover:bg-blue-700 text-white  p-2  rounded-lg"
                  >
                    View Details
                  </button>
                  <button
                    //   onClick={() => handleShowMap(route.id)}
                    className=" bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg"
                  >
                    Show on Map
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
        onPageChange={onPageChange}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
        forcePage={currentPage - 1}
      />
      {showRouteDetails && selectedRoute && (
        <RouteDetailForm
          route={selectedRoute}
          onClose={() => setShowRouteDetails(false)}
        />
      )}

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Close
        </button>
        {/* </>
        )} */}
      </div>
    </div>
  );
}

export default PlanDetailForm;
