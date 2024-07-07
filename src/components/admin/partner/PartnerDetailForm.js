import React, { useState, useRef } from "react";
import { API_URL2 } from "../../../utils/constant";
import { useCookies } from "react-cookie";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { formatNumber } from '../../../utils/commonUtils';
import { useTableDragScroll } from '../../../hooks/useTableDragScroll';

function PartnerDetailForm({
  partner,
  orders,
  currentPage,
  pageCount,
  onClose,
  onPartnerUpdated,
  onPageChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(partner);
  const [cookies] = useCookies(["token"]);
  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } = useTableDragScroll(tableRef);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      let response = await fetch(
        `/api/management/admin/partner/${partner.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 200) {
        toast.success("Partner information updated successfully.");
        const data = await response.json();
        onPartnerUpdated(data.data);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update partner information");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const renderInfoItem = (label, value, editComponent = null) => (
    <div className="mb-4">
      <span className="font-semibold">{label}:</span>{" "}
      {isEditing && editComponent ? editComponent : value}
    </div>
  );

  const getStatusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-red-100 text-red-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Partner Details</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          {renderInfoItem("Name", partner.name, 
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem("Address", partner.address,
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem("Phone", partner.phone,
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem("Status", getStatusBadge(partner.status),
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          )}
          {renderInfoItem("Gender", partner.gender,
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          )}
          {renderInfoItem("Created At", new Date(partner.created_at).toLocaleString())}
        </div>
        <div>
          {renderInfoItem("Date of Birth", partner.date_of_birth,
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem("Number of Orders", partner.number_of_order)}
          {renderInfoItem("Bonus", `${formatNumber(partner.bonus)} VND`)}
          {renderInfoItem("Revenue", `${formatNumber(partner.revenue)} VND`)}
          {renderInfoItem("Commission", `${formatNumber(partner.commission)} VND`)}
          {renderInfoItem("Updated At", new Date(partner.updated_at).toLocaleString())}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Orders</h3>
      <div 
        className="overflow-x-auto mb-6"
        ref={tableRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Code Order", "Customer Name", "Phone", "Price", "Commission", "Address", "Status"].map((header) => (
                <th key={header} className="p-2 text-left text-sm font-semibold text-gray-600 border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-2 border-b">{order.id}</td>
                <td className="p-2 border-b">{order.code_order}</td>
                <td className="p-2 border-b">{order.customer_name}</td>
                <td className="p-2 border-b">{order.phone}</td>
                <td className="p-2 border-b">{formatNumber(order.price)}</td>
                <td className="p-2 border-b">{formatNumber(order.commission)}</td>
                <td className="p-2 border-b">{order.address}</td>
                <td className="p-2 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "Success" ? "bg-green-100 text-green-800" :
                    order.status === "Delivery" ? "bg-blue-100 text-blue-800" :
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "Waiting" ? "bg-purple-100 text-purple-800" :
                    "bg-red-100 text-red-800"
                  }`}>
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
          previousClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
          nextClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
          activeClassName={"!bg-blue-500 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          forcePage={currentPage - 1}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
        />
      )}

      <div className="flex justify-end mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PartnerDetailForm;