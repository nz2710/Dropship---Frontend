import React, { useRef } from "react";
import ReactPaginate from "react-paginate";
import { formatNumber } from '../../utils/commonUtils';
import { useTableDragScroll } from '../../hooks/useTableDragScroll';

function OrderDetailForm({
  order,
  products,
  currentPage,
  pageCount,
  onClose,
  onPageChange,
}) {
  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } = useTableDragScroll(tableRef);

  const renderInfoItem = (label, value) => (
    <div className="mb-2">
      <span className="font-semibold">{label}:</span> {value}
    </div>
  );

  const getStatusBadge = (status) => {
    const colors = {
      Success: "bg-green-100 text-green-800",
      Delivery: "bg-blue-100 text-blue-800",
      Pending: "bg-yellow-100 text-yellow-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.Pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          {renderInfoItem("Code Order", order.order.code_order)}
          {renderInfoItem("Customer", order.order.customer_name)}
          {renderInfoItem("Phone", order.order.phone)}
          {renderInfoItem("Address", order.order.address)}
          {renderInfoItem("Created at", new Date(order.order.created_at).toLocaleString())}
        </div>
        <div>
          {renderInfoItem("Partner", order.order.partner?.name || "N/A")}
          {renderInfoItem("Price", `${formatNumber(order.order.price)} VND`)}
          {renderInfoItem("Discount", `${order.order.discount}%`)}
          {renderInfoItem("Status", getStatusBadge(order.order.status))}
          {renderInfoItem("Updated at", new Date(order.order.updated_at).toLocaleString())}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Products</h3>
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
              {["Name", "SKU", "Price", "Quantity", "Status"].map((header) => (
                <th key={header} className="p-2 text-left text-sm font-semibold text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.sku}</td>
                <td className="p-2">{formatNumber(product.price)} VND</td>
                <td className="p-2">{product.quantity}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {product.status}
                  </span>
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
          onPageChange={onPageChange}
          containerClassName={"flex justify-center items-center space-x-2 mt-4"}
          pageClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
          previousClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
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

export default OrderDetailForm;