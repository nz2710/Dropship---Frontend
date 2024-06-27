import React, { useState } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { formatNumber } from "../../utils/commonUtils";

function ProductDetailForm({ product, onClose, onProductUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(product);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cookies] = useCookies(["token"]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("cost", formData.cost);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("status", formData.status);

      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      const response = await fetch(
        `${API_URL2}/api/admin/product/${product.id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
          body: formDataToSend,
        }
      );

      if (response.status === 200) {
        toast.success("Product information updated successfully.");
        const updatedProduct = await response.json();
        onProductUpdated(updatedProduct.data);
        setIsEditing(false);
        setSelectedImage(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product information");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const renderInfoItem = (label, value, editComponent = null) => (
    <div className="mb-4">
      <span className="font-semibold">{label}:</span>{" "}
      {isEditing && editComponent ? editComponent : value}
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
      <h2 className="text-2xl font-bold mb-6">Product Details</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          {renderInfoItem(
            "Name",
            product.name,
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          )}
          {renderInfoItem(
            "Cost",
            `${formatNumber(product.cost)} VND`,
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          )}

          {renderInfoItem(
            "Description",
            product.description,
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            ></textarea>
          )}
          {renderInfoItem(
            "Status",
            getStatusBadge(product.status),
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          )}
          {renderInfoItem(
            "Image",
            <img
              src={`http://localhost:82/images/products/${product.image}`}
              alt={product.name}
              className="w-20 h-20 object-cover"
            />,
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
          )}
        </div>
        <div>
          {renderInfoItem("SKU", product.sku)}

          {renderInfoItem(
            "Quantity",
            product.quantity,
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          )}
          {renderInfoItem(
            "Price",
            `${formatNumber(product.price)} VND`,
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          )}

          {renderInfoItem(
            "Created at",
            new Date(product.created_at).toLocaleString()
          )}
          {renderInfoItem(
            "Updated at",
            new Date(product.updated_at).toLocaleString()
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Edit
            </button>
            <button
              onClick={onClose}
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

export default ProductDetailForm;
