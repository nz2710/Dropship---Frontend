import React from "react";

function DepotDetailsModal({
  setShowDetailModal,
  selectedDepot,
  editing,
  setEditing,
  setSelectedDepot,
  handleSaveDepot,
}) {
  return (
    <div className="p-2">
      <h2 className="text-lg font-bold mb-4">Depot Details</h2>
      {selectedDepot && (
        <div>
          <div className="flex">
            <div className="w-1/2 mr-2">
              <label className="block mb-1 font-bold">Name</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={selectedDepot.name}
                  onChange={(e) =>
                    setSelectedDepot({
                      ...selectedDepot,
                      name: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              ) : (
                <p>{selectedDepot.name}</p>
              )}
            </div>
            <div className="w-1/2 ml-2">
              <label className="block mb-1 font-bold">Code</label>
              <p>D{selectedDepot.id}</p>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 mr-2">
              <label className="block mb-1 font-bold">Phone</label>
              {editing ? (
                <input
                  type="text"
                  name="phone"
                  value={selectedDepot.phone}
                  onChange={(e) =>
                    setSelectedDepot({
                      ...selectedDepot,
                      phone: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              ) : (
                <p>{selectedDepot.phone}</p>
              )}
            </div>
            <div className="w-1/2 ml-2">
              <label className="block mb-1 font-bold">Address</label>
              {editing ? (
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
              ) : (
                <p>{selectedDepot.address}</p>
              )}
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 mr-2">
              <label className="block mb-1 font-bold">Longitude</label>
              <p>{parseFloat(selectedDepot.longitude)}</p>
            </div>
            <div className="w-1/2 ml-2">
              <label className="block mb-1 font-bold">Latitude</label>
              <p>{parseFloat(selectedDepot.latitude)}</p>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 mr-2">
              <label className="block mb-1 font-bold">Created Time</label>
              <p>{new Date(selectedDepot.created_at).toLocaleString()}</p>
            </div>
            <div className="w-1/2 ml-2">
              <label className="block mb-1 font-bold">Updated Time</label>
              <p>{new Date(selectedDepot.updated_at).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex">
            <div className="w-full">
              <label className="block mb-1 font-bold">Status</label>
              {editing ? (
                <select
                  name="status"
                  value={selectedDepot.status}
                  onChange={(e) =>
                    setSelectedDepot({
                      ...selectedDepot,
                      status: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-md w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              ) : (
                <p
                  className={
                    selectedDepot.status === "Active"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {selectedDepot.status}
                </p>
              )}
            </div>
          </div>
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
  );
}

export default DepotDetailsModal;
