import React, { useState } from "react";
import { API_URL2 } from "../../../utils/constant";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { formatNumber } from "../../../utils/commonUtils";

function VehicleDetailForm({ vehicle, onClose, onVehicleUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(vehicle);
  const [cookies] = useCookies(["token"]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${API_URL2}/api/admin/vehicle/${vehicle.id}`,
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
        toast.success("Vehicle information updated successfully.");
        const updatedVehicle = await response.json();
        onVehicleUpdated(updatedVehicle.data);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update vehicle information");
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
      Inactive: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Vehicle Details</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          {renderInfoItem(
            "Name",
            vehicle.name,
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}

          {renderInfoItem(
            "Capacity (kg)",
            vehicle.capacity,
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}

          {renderInfoItem(
            "Hourly Rate (VND/h)",
            formatNumber(vehicle.hourly_rate),
            <input
              type="number"
              name="hourly_rate"
              value={formData.hourly_rate}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}

          {renderInfoItem(
            "Fuel Consumption (l/km)",
            vehicle.fuel_consumption,
            <input
              type="number"
              name="fuel_consumption"
              value={formData.fuel_consumption}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem(
            "Created At",
            new Date(vehicle.created_at).toLocaleString()
          )}
          {renderInfoItem(
            "Status",
            getStatusBadge(vehicle.status),
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
        </div>
        <div>
          {renderInfoItem(
            "Total Vehicle",
            vehicle.total_vehicles,
            <input
              type="number"
              name="total_vehicles"
              value={formData.total_vehicles}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}

          {renderInfoItem(
            "Speed (km/h)",
            vehicle.speed,
            <input
              type="number"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}

          {renderInfoItem(
            "Shipping Rate (VND/kg)",
            formatNumber(vehicle.shipping_rate),
            <input
              type="number"
              name="shipping_rate"
              value={formData.shipping_rate}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}

          {renderInfoItem(
            "Fuel Cost (VND)",
            formatNumber(vehicle.fuel_cost),
            <input
              type="number"
              name="fuel_cost"
              value={formData.fuel_cost}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}

          {renderInfoItem(
            "Updated At",
            new Date(vehicle.updated_at).toLocaleString()
          )}
        </div>
      </div>

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

export default VehicleDetailForm;
