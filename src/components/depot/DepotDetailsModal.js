import React from "react";

function DepotDetailsModal({
  showDetailModal,
  setShowDetailModal,
  selectedDepot,
  editing,
  setEditing,
  setSelectedDepot,
  handleSaveDepot,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4">Depot Details</h2>
        {selectedDepot && (
          <div>
            {editing ? (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Depot Name"
                  value={selectedDepot.name}
                  onChange={(e) =>
                    setSelectedDepot({
                      ...selectedDepot,
                      name: e.target.value,
                    })
                  }
                  className="block w-full p-2 border border-gray-300 rounded mb-2"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={selectedDepot.address}
                  onChange={(e) =>
                    setSelectedDepot({
                      ...selectedDepot,
                      address: e.target.value,
                    })
                  }
                  className="block w-full p-2 border border-gray-300 rounded mb-2"
                />
                <select
                  name="status"
                  value={selectedDepot.status}
                  onChange={(e) =>
                    setSelectedDepot({
                      ...selectedDepot,
                      status: e.target.value,
                    })
                  }
                  className="block w-full p-2 border border-gray-300 rounded mb-2"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {selectedDepot.name}
                </p>
                <p>
                  <strong>Address:</strong> {selectedDepot.address}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedDepot.status === "1" ? "Active" : "Inactive"}
                </p>
              </>
            )}
            <p>
              <strong>Code:</strong> D{selectedDepot.id}
            </p>
            <p>
              <strong>Longitude:</strong> {selectedDepot.longitude}
            </p>
            <p>
              <strong>Latitude:</strong> {selectedDepot.latitude}
            </p>
            <p>
              <strong>Created Time:</strong>{" "}
              {new Date(selectedDepot.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Updated Time:</strong>{" "}
              {new Date(selectedDepot.updated_at).toLocaleString()}
            </p>
          </div>
        )}
        <div className="flex justify-end mt-4 space-x-2">
          {editing ? (
            <>
              <button
                onClick={handleSaveDepot}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DepotDetailsModal;