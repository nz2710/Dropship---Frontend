import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { API_URL2 } from "../../../utils/constant"


function AddMilestoneForm({ onClose, onMilestoneAdded }) {
  const [revenueMilestone, setRevenueMilestone] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [cookies] = useCookies(["token"]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`${API_URL2}/api/admin/rule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify({
          revenue_milestone: revenueMilestone,
          bonus_amount: bonusAmount,
        }),
      });
      if (response.ok) {
        toast.success("Milestone added successfully");
        onMilestoneAdded();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add milestone");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Milestone</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="revenue_milestone" className="block mb-1">
            Revenue Milestone (VND)
          </label>
          <input
            type="number"
            id="revenue_milestone"
            value={revenueMilestone}
            onChange={(e) => setRevenueMilestone(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bonus_amount" className="block mb-1">
            Bonus Amount (VND)
          </label>
          <input
            type="number"
            id="bonus_amount"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
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
            Add Milestone
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMilestoneForm;