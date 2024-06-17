import { useState, useEffect, useCallback } from "react";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Settings() {
  const [isTimeLimitEnabled, setIsTimeLimitEnabled] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [isVehicleLimitEnabled, setIsVehicleLimitEnabled] = useState(false);
  const [vehicleLimit, setVehicleLimit] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(["token"]);

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL2}/api/admin/vehicle`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data.data)) {
          setVehicles(data.data.data);
        } else {
          console.error("Invalid data format. Expected an array.");
          setVehicles([]);
        }
      } else {
        throw new Error("Failed to fetch vehicles");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }, [cookies.token]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true); // Bắt đầu hiển thị loading

      const data = {
        time_limit: isTimeLimitEnabled ? timeLimit : null,
        num_vehicles: isVehicleLimitEnabled ? vehicleLimit : null,
        vehicle_id: vehicleId,
      };

      const response = await fetch(
        `${API_URL2}/api/admin/routing/generateFile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      setIsLoading(false); // Ẩn loading sau khi nhận được phản hồi

      if (response.status === 200) {
        toast.success("Settings successfully saved.");
        // Chuyển hướng sang trang "/plan" sau 3 giây
        setTimeout(() => {
          window.location.href = "/plan";
        }, 3000);
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      setIsLoading(false); // Ẩn loading nếu có lỗi
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="bg-white w-4/5 m-auto pb-5 rounded-md">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex justify-between border-b border-gray-300 p-3">
        <p>Cấu hình thuật toán</p>
        <button
          className="w-20 bg-green-500 text-white rounded-md flex items-center justify-center"
          onClick={handleSubmit}
          disabled={isLoading} // Vô hiệu hóa nút trong khi đang loading
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            "Next"
          )}
        </button>
      </div>
      <div className="m-4 border border-gray-400 rounded-md">
        <p className="border-b border-gray-300 p-3">Cơ bản</p>
        <div className="m-4">
          <div className="flex gap-5 mb-3">
            <div>
              <p>Giới hạn giờ chạy</p>
              <label className="inline-flex items-center me-5 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isTimeLimitEnabled}
                  onChange={() => setIsTimeLimitEnabled(!isTimeLimitEnabled)}
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div>
              <p>Thời gian chạy xe tối đa trong một ngày (phút)</p>
              <input
                className="outline-none p-1 border border-gray-300"
                disabled={!isTimeLimitEnabled}
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-5 mb-3">
            <div>
              <p>Chọn đội xe</p>
              <select
                className="outline-none p-1 border border-gray-300"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p>Giới hạn số lượng xe</p>
              <label className="inline-flex items-center me-5 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isVehicleLimitEnabled}
                  onChange={() =>
                    setIsVehicleLimitEnabled(!isVehicleLimitEnabled)
                  }
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div>
              <p>Số lượng xe</p>
              <input
                className="outline-none p-1 border border-gray-300"
                disabled={!isVehicleLimitEnabled}
                value={vehicleLimit}
                onChange={(e) => setVehicleLimit(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
