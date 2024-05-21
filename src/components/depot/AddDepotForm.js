import React from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useEffect } from "react";

function AddDepotForm({ showModal, setShowModal, handleSubmit, handleInputChange }) {
  const accessToken =
    "pk.eyJ1IjoibmdvZHVuZzI3MTAiLCJhIjoiY2x2MjF1eTQxMGR4NjJsbWlsMWZmZHluYiJ9.zBLJ9oWBuSXllU5S0zsS2Q";

  useEffect(() => {
    const addressInput = document.getElementById("address-input");
    if (addressInput) {
      const geocoder = new MapboxGeocoder({
        accessToken: accessToken,
        types: "address",
        placeholder: "Enter address",
      });
      geocoder.addTo(addressInput);
      geocoder.on("result", (e) => {
        const selectedAddress = e.result.place_name;
        handleInputChange({ target: { name: "address", value: selectedAddress } });
      });
    }
  }, [showModal]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4">Add New Depot</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Depot Name"
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <div
            id="address-input"
            className="block w-full p-2 border border-gray-300 rounded"
          ></div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDepotForm;