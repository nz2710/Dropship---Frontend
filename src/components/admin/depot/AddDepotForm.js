import React from "react";
import { useState } from "react";

function AddDepotForm({ setShowModal, handleSubmit, handleInputChange }) {
  const goongApiKey = "VWEykUxNr5f4DReznrCTAtui2DL8iuXXdjapLuJv";
  const [suggestions, setSuggestions] = useState([]);
  const handleAddressInput = async (event) => {
    const input = event.target.value;
    handleInputChange({ target: { name: "address", value: input } });
    if (input.length > 2) {
      let response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${goongApiKey}&input=${encodeURIComponent(
          input
        )}`
      );
      const data = await response.json();
      setSuggestions(data.predictions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const addressInput = document.getElementById("address-input");
    if (addressInput) {
      addressInput.value = suggestion.description;
      handleInputChange({
        target: { name: "address", value: suggestion.description },
      });
    }
    setSuggestions([]);
  };

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
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <div className="relative">
            <input
              type="text"
              id="address-input"
              name="address"
              placeholder="Enter address"
              onInput={handleAddressInput}
              className="block w-full p-2 border border-gray-300 rounded"
            />
            {suggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
