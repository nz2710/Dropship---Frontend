import { useState } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function AddVehicleForm({ onClose, onVehicleAdded }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [speed, setSpeed] = useState("");
  const [fuel_consumption, setFuelConsumption] = useState("");
  const [fuel_cost, setFuelCost] = useState("");
  const [total_vehicles, setTotalVehicle] = useState("");
  const [cookies] = useCookies(["token"]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL2}/api/admin/vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify({
          name,
          capacity,
          speed,
          fuel_consumption,
          fuel_cost,
          total_vehicles,
        }),
      });
      if (response.status === 200) {
        toast.success("Vehicle added successfully");
        onVehicleAdded();
        onClose();
      } else {
        throw new Error("Failed to add vehicle");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="total_vehicles" className="block mb-1">
              Total Vehicles
            </label>
            <input
              type="number"
              id="total_vehicles"
              value={total_vehicles}
              onChange={(e) => setTotalVehicle(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="capacity" className="block mb-1">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="speed" className="block mb-1">
              Speed
            </label>
            <input
              type="number"
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="fuel_consumption" className="block mb-1">
              Fuel Consumption
            </label>
            <input
              type="number"
              id="fuel_consumption"
              value={fuel_consumption}
              onChange={(e) => setFuelConsumption(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="fuel_cost" className="block mb-1">
              Fuel Cost
            </label>
            <input
              type="number"
              id="fuel_cost"
              value={fuel_cost}
              onChange={(e) => setFuelCost(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddVehicleForm;
