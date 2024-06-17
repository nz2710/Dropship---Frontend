import React from "react";
import ReactPaginate from "react-paginate";
import { useCookies } from "react-cookie";

function PlanDetailForm({
  plan,
  routes,
  currentPage,
  pageCount,
  onClose,
  onPageChange,
}) {
  const [cookies] = useCookies(["token"]);
  const handleViewDetails = (routeId) => {
    const token = cookies.token;
    const newUrl = `/route/${routeId}?token=${token}`;
  
    // Thay đổi URL mà không có tham số token
    window.history.pushState({}, "", `/route/${routeId}`);
  
    // Mở tab mới với URL chứa token
    window.open(newUrl, "_blank");
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
          <label className="block mb-1 font-bold">Total Distance (km)</label>
          <p>{parseFloat(plan.total_distance)}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">
            Total Unallocated Distance (km)
          </label>
          <p>{parseFloat(plan.total_distance_without_allocating_vehicles)}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Total Time (minutes)</label>
          <p>{parseFloat(plan.total_time_serving)}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">
            Total Unallocated Time (minutes)
          </label>
          <p>
            {parseFloat(plan.total_time_serving_without_allocating_vehicles)}
          </p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Total Demand (kg)</label>
          <p>{parseFloat(plan.total_demand)}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">
            Total Unallocated Demand (kg)
          </label>
          <p>{parseFloat(plan.total_demand_without_allocating_vehicles)}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Total Fee (VND)</label>
          <p>
            {plan.fee
              ? parseFloat(plan.fee).toLocaleString("en-US", {
                  maximumSignificantDigits: 20,
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
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Created at</label>
          <p>{new Date(plan.created_at).toLocaleString()}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Updated at</label>
          <p>{new Date(plan.updated_at).toLocaleString()}</p>
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
            <th className="border px-4 py-2">Depot</th>
            <th className="border px-4 py-2">Demand (kg)</th>
            <th className="border px-4 py-2">Distance (km)</th>
            <th className="border px-4 py-2">Time (minutes)</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td className="border px-4 py-2">{route.id}</td>
              <td className="border px-4 py-2">{route.depot_name}</td>
              <td className="border px-4 py-2">
                {parseFloat(route.total_demand)}
              </td>
              <td className="border px-4 py-2">
                {parseFloat(route.total_distance)}
              </td>
              <td className="border px-4 py-2">
                {parseFloat(route.total_time_serving)}
              </td>
              <td className="border px-4 py-2">
                {route.is_served === 1 ? (
                  <span className="text-green-500">Served</span>
                ) : (
                  <span className="text-red-500">Unserved</span>
                )}
              </td>
              <td className="border py-3 text-center">
                <button
                  onClick={() => handleViewDetails(route.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pageCount > 0 && (
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
      )}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PlanDetailForm;
