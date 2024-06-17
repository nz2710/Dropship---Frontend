import React from "react";
import { API_URL2 } from "../../utils/constant";
// import { useCookies } from "react-cookie";
// import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function OrderDetailForm({
  order,
  products,
  currentPage,
  pageCount,
  onClose,
  onPageChange,
}) {
  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-3">Order Details</h2>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Code Order</label>
          {/* {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : ( */}
          <p>{order.order.code_order}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Price (VND)</label>
          <p>
            {order.order.price
              ? parseFloat(order.order.price).toLocaleString("en-US", {
                  maximumSignificantDigits: 20,
                })
              : ""}
          </p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Partner</label>
          {/* {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            ></textarea>
          ) : ( */}
          <p>{order.order.partner && order.order.partner.name}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Discount (%)</label>
          {/* {isEditing ? (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : ( */}
          <p>{parseFloat(order.order.discount)}</p>

          {/* <p
              className={
                product.status === "active" ? "text-green-500" : "text-red-500"
              }
            >
              {product.status === "active" ? "Active" : "Inactive"}
            </p> */}
          {/* )} */}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Customer Name</label>
          {/* {isEditing ? (
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : ( */}
          <p>{order.order.customer_name}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Phone</label>
          {/* {isEditing ? (
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : ( */}
          <p>{order.order.phone}</p>
          {/* )} */}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Address</label>
          {/* {isEditing ? (
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          ) : ( */}
          <p>{order.order.address}</p>
          {/* )} */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Status</label>
          <p>
            {order.order.status === "Success" ? (
              <span className="text-green-500">Success</span>
            ) : order.order.status === "Delivery" ? (
              <span className="text-yellow-500">Delivery</span>
            ) : (
              <span className="text-red-500">Pending</span>
            )}
          </p>
          {/* {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
          )} */}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Longitude</label>
          <p>{parseFloat(order.order.longitude)}</p>
          {/* Sử dụng parseFloat để loại bỏ các số 0 thừa */}
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Latitude</label>
          <p>{parseFloat(order.order.latitude)}</p>
          {/* Sử dụng parseFloat để loại bỏ các số 0 thừa */}
        </div>
      </div>

      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Weight (kg)</label>
          <p>{parseFloat(order.order.mass_of_order)}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Time Service (minutes)</label>
          <p>{order.order.time_service}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mr-2">
          <label className="block mb-1 font-bold">Created at</label>
          <p>{new Date(order.order.created_at).toLocaleString()}</p>
        </div>
        <div className="w-1/2 ml-2">
          <label className="block mb-1 font-bold">Updated at</label>
          <p>{new Date(order.order.updated_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Thêm bảng hiển thị thông tin product ở đây */}
      <h3 className="text-lg font-bold">Products</h3>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Price (VND)</th>
            <th className="border px-4 py-2">Cost (VND)</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.sku}</td>
              <td className="border px-4 py-2">
                {product.price
                  ? parseFloat(product.price).toLocaleString("en-US", {
                      maximumSignificantDigits: 20,
                    })
                  : ""}
              </td>
              <td className="border px-4 py-2">
                {product.cost
                  ? parseFloat(product.cost).toLocaleString("en-US", {
                      maximumSignificantDigits: 20,
                    })
                  : ""}
              </td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">
                <img
                  src={`${API_URL2}/images/products/${product.image}`}
                  alt={product.name}
                  className="w-20 h-20 object-cover"
                />
              </td>
              <td className="border px-4 py-2">
                {product.status === "Active" ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pageCount > 0 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={onPageChange}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
          forcePage={currentPage - 1}
        />
      )}
      <div className="flex justify-end">
        {/* {isEditing ? (
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
        ) : ( */}
        {/* <> */}
        {/* <button
              onClick={handleEdit}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 mr-2"
            >
              Edit
            </button> */}
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Close
        </button>
        {/* </>
        )} */}
      </div>
    </div>
  );
}

export default OrderDetailForm;
