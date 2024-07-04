import React, { useState, useRef } from "react";
import ReactPaginate from "react-paginate";
import { useTableDragScroll } from "../../../hooks/useTableDragScroll";

function CompletePlanForm({
  routes,
  currentPage,
  pageCount,
  onClose,
  onPageChange,
  onCompletePlan,
}) {
  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const [selectedRoutes, setSelectedRoutes] = useState({});
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const handleRouteSelect = (routeId) => {
    setSelectedRoutes(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
    setSelectedOrders(prev => ({
      ...prev,
      [routeId]: {}
    }));
  };

  const handleOrderSelect = (routeId, orderId) => {
    setSelectedOrders(prev => ({
      ...prev,
      [routeId]: {
        ...prev[routeId],
        [orderId]: !prev[routeId]?.[orderId]
      }
    }));
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRoutes({});
    setSelectedOrders({});
  };

  const handleComplete = () => {
    const completedRoutes = routes.map(route => ({
      route_id: route.id,
      is_fully_completed: selectedRoutes[route.id] || selectAll,
      completed_orders: selectedRoutes[route.id] || selectAll
        ? route.orders.map(order => order.id)
        : Object.keys(selectedOrders[route.id] || {}).filter(orderId => selectedOrders[route.id][orderId])
    })).filter(route => route.is_fully_completed || route.completed_orders.length > 0);

    onCompletePlan({
      all_routes_completed: selectAll,
      completed_routes: completedRoutes
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Plan</h2>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Routes</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectAll}
            onChange={handleSelectAll}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <label htmlFor="selectAll" className="ml-2 text-sm text-gray-600">Select All Routes</label>
        </div>
      </div>

      <div
        className="overflow-x-auto mb-6 border border-gray-200 rounded-lg shadow-sm"
        ref={tableRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRoutes[route.id] || selectAll}
                    onChange={() => handleRouteSelect(route.id)}
                    disabled={selectAll}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded transition-all duration-150"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {route.id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {route.orders.map((order) => (
                      <div key={order.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRoutes[route.id] || selectAll || selectedOrders[route.id]?.[order.id]}
                          onChange={() => handleOrderSelect(route.id, order.id)}
                          disabled={selectedRoutes[route.id] || selectAll}
                          className="form-checkbox h-3 w-3 text-blue-600 rounded mr-1 transition-all duration-150"
                        />
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {order.code_order || order.id}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          pageCount={pageCount}
          onPageChange={onPageChange}
          containerClassName={"flex justify-center items-center space-x-2 my-4"}
          pageClassName={"px-3 py-1 rounded-md bg-gray-100 text-sm hover:bg-gray-200 transition-colors duration-150"}
          previousClassName={"px-3 py-1 rounded-md bg-gray-100 text-sm hover:bg-gray-200 transition-colors duration-150"}
          nextClassName={"px-3 py-1 rounded-md bg-gray-100 text-sm hover:bg-gray-200 transition-colors duration-150"}
          activeClassName={"!bg-blue-500 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          forcePage={currentPage - 1}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
        />
      )}

      <div className="flex justify-end mt-6 space-x-4">
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150"
        >
          Complete Selected
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CompletePlanForm;