import React from "react";
import { useState, useEffect } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import ReactPaginate from "react-paginate";

function RouteDetailForm({ route, onClose }) {
    const [orderAddresses, setOrderAddresses] = useState([]);
      const [cookies] = useCookies(["token"]);

    useEffect(() => {
      const fetchOrderAddresses = async () => {
        const orderIds = route.route;
        const addresses = [];
  
        for (const orderId of orderIds) {
          try {
            const response = await fetch(`${API_URL2}/api/admin/order/${orderId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + cookies.token,
              },
            });
  
            if (response.status === 200) {
              const data = await response.json();
              addresses.push(data.data.address);
            } else {
              throw new Error("Failed to fetch order details");
            }
          } catch (error) {
            console.error("Error fetching order details:", error);
          }
        }
  
        setOrderAddresses(addresses);
      };
  
      fetchOrderAddresses();
    }, [route]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Route Details</h2>
        <div className="mb-4">
          <label className="block font-bold mb-2">Route:</label>
          <p>{route.route.join(" -> ")}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default RouteDetailForm;