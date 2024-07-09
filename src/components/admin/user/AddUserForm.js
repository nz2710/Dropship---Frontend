import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Select from 'react-select';
import { API_URL, API_URL2 } from "../../../utils/constant"

const AddUserForm = ({ onClose, onUserAdded }) => {
  const [cookies] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("");
  const [partnerId, setPartnerId] = useState(null);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        let response = await fetch(`${API_URL2}/api/admin/getPartner`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        if (response.status === 200) {
          const body = await response.json();
          setPartners(body.data);
        } else {
          throw new Error("Failed to fetch partners");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    };
    fetchPartners();
  }, [cookies.token]);

  const partnerOptions = partners.map((partner) => ({
    value: partner.id,
    label: `${partner.id} - ${partner.name}`,
  }));

  const handlePartnerFilter = (option, inputValue) => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`${API_URL}/api/admin/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirmation: passwordConfirm,
          role_id: role,
          partner_id: partnerId,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.success(data.mes);
        onUserAdded();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Create user failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              value={passwordConfirm}
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            <option value="1">Admin</option>
            <option value="2">Partner</option>
          </select>
        </div>
        {role === "2" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Partner</label>
            <Select
              value={partnerOptions.find((option) => option.value === partnerId)}
              onChange={(selectedOption) => setPartnerId(selectedOption.value)}
              options={partnerOptions}
              filterOption={handlePartnerFilter}
              placeholder="Search partner"
              required
            />
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-gray-600 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;