import React, { useState } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

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

      const response = await fetch(`${API_URL2}/api/admin/product/${product.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: formDataToSend,
      });

      if (response.status === 200) {
        toast.success("Product information updated successfully.");
        const updatedProduct = await response.json();
        onProductUpdated(updatedProduct.data);
        setIsEditing(false);
        setSelectedImage(null);
      } else {
        throw new Error("Failed to update product information");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-3">Product Details</h2>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{product.name}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">SKU</label>
          <p>{product.sku}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Description</label>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            ></textarea>
          ) : (
            <p>{product.description}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Status</label>
          {isEditing ? (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <p
              className={
                product.status === "active" ? "text-green-500" : "text-red-500"
              }
            >
              {product.status === "active" ? "Active" : "Inactive"}
            </p>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Price</label>
          {isEditing ? (
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{product.price}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Cost</label>
          {isEditing ? (
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{product.cost}</p>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Quantity</label>
          {isEditing ? (
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : (
            <p>{product.quantity}</p>
          )}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Image</label>
          {product.image && (
            <img
              src={`http://localhost:82/images/products/${product.image}`}
              alt={product.name}
              className="w-40 h-40 object-cover"
            />
          )}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Created at</label>
          <p>{new Date(product.created_at).toLocaleString()}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Updated at</label>
          <p>{new Date(product.updated_at).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex justify-end">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 mr-2"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
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
