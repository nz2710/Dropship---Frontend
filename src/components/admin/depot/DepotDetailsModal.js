import React from "react";
import { formatNumber } from "../../../utils/commonUtils";

function DepotDetailsModal({
  setShowDetailModal,
  selectedDepot,
  editing,
  setEditing,
  setSelectedDepot,
  handleSaveDepot,
}) {
  const renderInfoItem = (label, value, editComponent = null) => (
    <div className="mb-4">
      <span className="font-semibold">{label}:</span>{" "}
      {editing && editComponent ? editComponent : value}
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
      <h2 className="text-2xl font-bold mb-6">Depot Details</h2>

      {selectedDepot && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            {renderInfoItem(
              "Name",
              selectedDepot.name,
              <input
                type="text"
                name="name"
                value={selectedDepot.name}
                onChange={(e) =>
                  setSelectedDepot({ ...selectedDepot, name: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-md w-full"
              />
            )}
            {renderInfoItem("Code", `D${selectedDepot.id}`)}
            {renderInfoItem(
              "Phone",
              selectedDepot.phone,
              <input
                type="text"
                name="phone"
                value={selectedDepot.phone}
                onChange={(e) =>
                  setSelectedDepot({ ...selectedDepot, phone: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-md w-full"
              />
            )}
            {renderInfoItem(
              "Address",
              selectedDepot.address,
              <input
                type="text"
                name="address"
                value={selectedDepot.address}
                onChange={(e) =>
                  setSelectedDepot({
                    ...selectedDepot,
                    address: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded-md w-full"
              />
            )}
            {renderInfoItem(
              "Status",
              getStatusBadge(selectedDepot.status),
              <select
                name="status"
                value={selectedDepot.status}
                onChange={(e) =>
                  setSelectedDepot({ ...selectedDepot, status: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-md w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            )}
          </div>
          <div>
            {renderInfoItem("Longitude", formatNumber(selectedDepot.longitude))}
            {renderInfoItem("Latitude", formatNumber(selectedDepot.latitude))}
            {renderInfoItem(
              "Created Time",
              new Date(selectedDepot.created_at).toLocaleString()
            )}
            {renderInfoItem(
              "Updated Time",
              new Date(selectedDepot.updated_at).toLocaleString()
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        {editing ? (
          <>
            <button
              onClick={handleSaveDepot}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDetailModal(false)}
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

export default DepotDetailsModal;
