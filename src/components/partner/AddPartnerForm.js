import { useState } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function AddPartnerForm({ onClose, onPartnerAdded }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [discount, setDiscount] = useState(10);
  const [gender, setGender] = useState("");
  const [cookies] = useCookies(["token"]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL2}/admin/partner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify({
          name,
          address,
          phone,
          date_of_birth: dateOfBirth,
          discount,
          gender,
        }),
      });
      if (response.status === 200) {
        toast.success("Partner added successfully");
        onPartnerAdded();
        onClose();
      } else {
        throw new Error("Failed to add partner");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Partner</h2>
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
            <label htmlFor="address" className="block mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="phone" className="block mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="dateOfBirth" className="block mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="discount" className="block mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="gender" className="block mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
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
            Add Partner
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPartnerForm;
