import React, { useState } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function VehicleDetailForm({ vehicle, onClose, onVehicleUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(vehicle);
  //   const [selectedImage, setSelectedImage] = useState(null);
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
        // setSelectedImage(null);
      } else {
        throw new Error("Failed to update vehicle information");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-3">Vehicle Details</h2>
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
            <p>{vehicle.name}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Total Vehicle</label>
          {isEditing ? (
            <input
              type="number"
              name="total_vehicles"
              value={formData.total_vehicles}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{vehicle.total_vehicles}</p>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Capacity (kg)</label>
          {isEditing ? (
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{vehicle.capacity}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Speed (km/h)</label>
          {isEditing ? (
            <input
              type="number"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{vehicle.speed}</p>
          )}
        </div>
        {/* <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Status</label>
          {isEditing ? (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <p
              className={
                product.status === "active" ? "text-green-500" : "text-red-500"
              }
            >
              {product.status === "active" ? "Active" : "Inactive"}
            </p>
          )}
        </div> */}
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">
            Fuel Consumption (l/km)
          </label>
          {isEditing ? (
            <input
              type="number"
              name="fuel_consumption"
              value={formData.fuel_consumption}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{vehicle.fuel_consumption}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Fuel Cost (VND)</label>
          {isEditing ? (
            <input
              type="number"
              name="fuel_cost"
              value={formData.fuel_cost}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>
              {vehicle.fuel_cost
                ? parseFloat(vehicle.fuel_cost).toLocaleString("vi-VN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : ""}
            </p>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Created At</label>
          <p>{new Date(vehicle.created_at).toLocaleString()}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Updated At</label>
          <p>{new Date(vehicle.updated_at).toLocaleString()}</p>
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-bold">Status</label>
        {isEditing ? (
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        ) : (
          <p
            className={
              vehicle.status === "active" ? "text-green-500" : "text-red-500"
            }
          >
            {vehicle.status === "active" ? "Active" : "Inactive"}
          </p>
        )}
      </div>

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

export default VehicleDetailForm;
