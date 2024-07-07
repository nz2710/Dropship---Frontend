import React from "react";
import { formatNumber } from "../../../utils/commonUtils";
import ReactPaginate from "react-paginate";

function CommissionDetailForm({
  commission,
  orders,
  currentPage,
  pageCount,
  onClose,
  onPageChange,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Commission Details</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <div className="mb-4">
            <span className="font-semibold">Partner ID:</span>{" "}
            {commission.partner_id}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Partner Name:</span>{" "}
            {commission.partner_name}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Total Base Price:</span>{" "}
            {formatNumber(commission.total_base_price)}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Revenue:</span>{" "}
            {formatNumber(commission.revenue)}
          </div>
        </div>
        <div>
          <div className="mb-4">
            <span className="font-semibold">Commission:</span>{" "}
            {formatNumber(commission.commission)}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Bonus:</span>{" "}
            {formatNumber(commission.bonus)}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Total Amount:</span>{" "}
            {formatNumber(commission.total_amount)}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Order Count:</span>{" "}
            {commission.order_count}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Orders</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {[
                "ID",
                "Code Order",
                "Customer Name",
                "Phone",
                "Price",
                "Commission",
                "Address",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  className="p-2 text-left text-sm font-semibold text-gray-600 border-b"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-2 border-b">{order.id}</td>
                <td className="p-2 border-b">{order.code_order}</td>
                <td className="p-2 border-b">{order.customer_name}</td>
                <td className="p-2 border-b">{order.phone}</td>
                <td className="p-2 border-b">{formatNumber(order.price)}</td>
                <td className="p-2 border-b">
                  {formatNumber(order.commission)}
                </td>
                <td className="p-2 border-b">{order.address}</td>
                <td className="p-2 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Delivery"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Waiting"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
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

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CommissionDetailForm;
