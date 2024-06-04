import React, { useState } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import ReactPaginate from 'react-paginate';
import {toast} from "react-toastify";


function PartnerDetailForm({ partner, orders, currentPage, pageCount, onClose, onPartnerUpdated, onPageChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(partner);
  const [cookies] = useCookies(["token"]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL2}/api/admin/partner/${partner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.status === 200) {
        toast.success("Partner information updated successfully.");
        const data = await response.json();
        onPartnerUpdated(data.data);
        setIsEditing(false);
      } else {
        throw new Error("Failed to update partner information");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-3">Partner Details</h2>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{partner.name}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Address</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{partner.address}</p>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Phone</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{partner.phone}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Status</label>
          {isEditing ? (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          ) : (
            <p>{partner.status === "1" ? "Active" : "Inactive"}</p>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Gender</label>
          {isEditing ? (
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p>{partner.gender}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{partner.date_of_birth}</p>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Number of Orders</label>
          <p>{partner.number_of_order}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Discount</label>
          {isEditing ? (
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{partner.discount}</p>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Revenue</label>
          <p>{partner.revenue}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Commission</label>
          <p>{partner.commission}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Created At</label>
          <p>{new Date(partner.created_at).toLocaleString()}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Updated At</label>
          <p>{new Date(partner.updated_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Thêm bảng hiển thị thông tin order ở đây */}
      <h3 className="text-lg font-bold">Orders</h3>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Code Order</th>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Discount</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.code_order}</td>
              <td className="border px-4 py-2">{order.customer_name}</td>
              <td className="border px-4 py-2">{order.phone}</td>
              <td className="border px-4 py-2">{order.price}</td>
              <td className="border px-4 py-2">{order.discount}</td>
              <td className="border px-4 py-2">{order.address}</td>
              <td className="border px-4 py-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
      previousLabel={'Previous'}
      nextLabel={'Next'}
      pageCount={pageCount}
      onPageChange={onPageChange}
      containerClassName={'pagination'}
      previousLinkClassName={'pagination__link'}
      nextLinkClassName={'pagination__link'}
      disabledClassName={'pagination__link--disabled'}
      activeClassName={'pagination__link--active'}
      forcePage={currentPage - 1}
    />

      {/* Render other partner details */}
      {/* ... */}
      <div className="flex justify-end">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 mr-2"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
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
