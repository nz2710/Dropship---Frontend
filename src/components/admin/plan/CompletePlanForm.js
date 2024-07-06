import React, { useState, useRef } from "react";
import Select from "react-select";
import { useTableDragScroll } from "../../../hooks/useTableDragScroll";

function CompletePlanForm({
  selectedPlanForCompletion,
  incompleteOrderIds,
  setIncompleteOrderIds,
  onCompleteConfirm,
  onClose,
}) {
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAllOrders, setSelectAllOrders] = useState(false);
  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  const handleOrderToggle = (orderId) => {
    setIncompleteOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const routeOptions = selectedPlanForCompletion?.routes.map(
    (route, index) => ({
      value: index,
      label: `Route ${route.route_id}`,
    })
  );

  const handleRouteChange = (selectedOption) => {
    setCurrentRouteIndex(selectedOption.value);
  };

  const renderRouteOrdersTable = () => {
    const currentRoute = selectedPlanForCompletion?.routes[currentRouteIndex];
    const filteredOrders = currentRoute?.orders.filter(
      (order) =>
        order.code_order.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer_name &&
          order.customer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (order.address &&
          order.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by order code, customer name, or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="selectAllOrders"
              checked={selectAllOrders}
              onChange={() => {
                setSelectAllOrders(!selectAllOrders);
                setIncompleteOrderIds(
                  selectAllOrders
                    ? []
                    : currentRoute.orders.map((order) => order.id)
                );
              }}
              className="mr-2 w-5 h-5"
            />
            <label htmlFor="selectAllOrders">Select all as incomplete</label>
          </div>
        </div>
        <div className="overflow-x-auto">
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
                    Incomplete
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={incompleteOrderIds.includes(order.id)}
                        onChange={() => handleOrderToggle(order.id)}
                        className="w-5 h-5"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.code_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customer_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.address || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Complete Plan</h2>
        <button
          onClick={onClose}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Route:
        </label>
        <Select
          options={routeOptions}
          value={routeOptions[currentRouteIndex]}
          onChange={handleRouteChange}
          className="w-full"
        />
      </div>
      {renderRouteOrdersTable()}
      <div className="flex justify-end mt-6 space-x-4">
        <button
          onClick={onCompleteConfirm}
          className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Complete Plan
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CompletePlanForm;
