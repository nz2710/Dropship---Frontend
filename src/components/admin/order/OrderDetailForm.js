import React, { useState, useRef, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { formatNumber } from "../../../utils/commonUtils";
import { useTableDragScroll } from "../../../hooks/useTableDragScroll";
import { API_URL2 } from "../../../utils/constant";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Select from "react-select";

function OrderDetailForm({
  order,
  products,
  currentPage,
  pageCount,
  onClose,
  onPageChange,
  onOrderUpdated,
  allProducts,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(order);
  const [editedProducts, setEditedProducts] = useState(products);
  const [originalFormData, setOriginalFormData] = useState(order);
  const [originalProducts, setOriginalProducts] = useState(products);
  const [cookies] = useCookies(["token"]);
  const tableRef = useRef(null);
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useTableDragScroll(tableRef);

  useEffect(() => {
    setOriginalFormData(order);
    setOriginalProducts(products);
  }, [order, products]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...editedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      pivot: {
        ...updatedProducts[index].pivot,
        [field]: value,
      },
    };
    setEditedProducts(updatedProducts);
  };

  const handleProductSelect = (productId) => {
    const selectedProduct = allProducts.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      setEditedProducts([
        ...editedProducts,
        {
          ...selectedProduct,
          pivot: {
            quantity: 1,
            price: selectedProduct.price,
          },
          originalQuantity: selectedProduct.quantity,
          originalPrice: selectedProduct.price,
        },
      ]);
    }
  };

  const handleProductRemove = (productId) => {
    setEditedProducts(
      editedProducts.filter((product) => product.id !== productId)
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalFormData);
    setEditedProducts(originalProducts);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        address: formData.address,
        customer_name: formData.customer_name,
        phone: formData.phone,
        mass_of_order: formData.mass_of_order,
        // time_service: formData.time_service,
        products: editedProducts.map((product) => ({
          id: product.id,
          quantity: parseInt(product.pivot.quantity),
          price: parseFloat(product.pivot.price),
        })),
      };

      let response = await fetch(`/api/management/admin/order/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.status === 200) {
        const data = await response.json();
        onOrderUpdated(data.data);
        setIsEditing(false);
        setOriginalFormData(formData);
        setOriginalProducts(editedProducts);
        // toast.success("Order updated successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const renderInfoItem = (label, value, name, editComponent = null) => (
    <div className="mb-2">
      <span className="font-semibold">{label}:</span>{" "}
      {isEditing && editComponent ? editComponent : value}
    </div>
  );

  const getStatusBadge = (status) => {
    const colors = {
      Success: "bg-green-100 text-green-800",
      Delivery: "bg-blue-100 text-blue-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Waiting: "bg-purple-100 text-purple-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[status] || colors.Pending
        }`}
      >
        {status}
      </span>
    );
  };

  const productOptions = allProducts.map((product) => ({
    value: product.id,
    label: `${product.name} - ${product.sku} (Stock: ${product.quantity})`,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          {renderInfoItem("Code Order", formData.code_order, "code_order")}
          {renderInfoItem(
            "Customer",
            formData.customer_name,
            "customer_name",
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem(
            "Phone",
            formData.phone,
            "phone",
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem(
            "Address",
            formData.address,
            "address",
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem(
            "Weight",
            `${formatNumber(formData.mass_of_order)} kg`,
            "mass_of_order",
            <input
              type="number"
              name="mass_of_order"
              value={formData.mass_of_order}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          )}
          {renderInfoItem(
            "Time Service",
            `${formatNumber(formData.time_service)} minutes`,
            "time_service"
            // <input
            //   type="number"
            //   name="time_service"
            //   value={formData.time_service}
            //   onChange={handleChange}
            //   className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            // />
          )}
          {renderInfoItem(
            "Created at",
            new Date(formData.created_at).toLocaleString(),
            "created_at"
          )}
          {renderInfoItem(
            "Updated at",
            new Date(formData.updated_at).toLocaleString(),
            "updated_at"
          )}
        </div>
        <div>
          {renderInfoItem(
            "Partner",
            formData.partner?.name || "N/A",
            "partner_id"
          )}
          {renderInfoItem(
            "Price",
            `${formatNumber(formData.price)} VND`,
            "price"
          )}
          {renderInfoItem(
            "Base Price",
            `${formatNumber(formData.total_base_price)} VND`,
            "total_base_price"
          )}
          {renderInfoItem(
            "Commission",
            `${formatNumber(formData.commission)} VND`,
            "commission"
          )}
          {renderInfoItem(
            "Total Cost",
            `${formatNumber(formData.total_cost)} VND`,
            "total_cost"
          )}
          {renderInfoItem(
            "Profit",
            `${formatNumber(formData.profit)} VND`,
            "profit"
          )}
          {renderInfoItem(
            "Status",
            getStatusBadge(formData.status),
            "status"
            // <select
            //   name="status"
            //   value={formData.status}
            //   onChange={handleChange}
            //   className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            // >
            //   <option value="Waiting">Waiting</option>
            //   <option value="Pending">Pending</option>
            //   <option value="Delivery">Delivery</option>
            //   <option value="Success">Success</option>
            // </select>
          )}
          {renderInfoItem(
            "Expected Date",
            formData.expected_date || "N/A",
            "expected_date"
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Products</h3>
      {isEditing && (
        <div className="mb-4">
          <label htmlFor="products" className="block mb-1">
            Add Product
          </label>
          <Select
            id="products"
            onChange={(selectedOption) =>
              handleProductSelect(selectedOption.value)
            }
            options={productOptions}
            placeholder="Search product"
          />
        </div>
      )}
      <div
        className="overflow-x-auto mb-6"
        ref={tableRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {["Name", "SKU", "Price", "Quantity", "Status", "Action"].map(
                (header) => (
                  <th
                    key={header}
                    className="p-2 text-left text-sm font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {editedProducts.map((product, index) => {
              const originalProduct = allProducts.find(
                (p) => p.id === product.id
              );
              const originalPrice = originalProduct
                ? originalProduct.price
                : product.originalPrice;
              const originalQuantity = originalProduct
                ? originalProduct.quantity
                : product.originalQuantity;

              return (
                <tr
                  key={product.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.sku}</td>
                  <td className="p-2">
                    {isEditing ? (
                      <div>
                        <input
                          type="number"
                          value={product.pivot.price}
                          onChange={(e) =>
                            handleProductChange(index, "price", e.target.value)
                          }
                          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          min="0"
                        />
                        {parseFloat(product.pivot.price) < originalPrice && (
                          <span className="text-yellow-500 text-xs">
                            Below original price ({originalPrice})
                          </span>
                        )}
                      </div>
                    ) : (
                      `${formatNumber(product.pivot.price)} VND`
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <div>
                        <input
                          type="number"
                          value={product.pivot.quantity}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          min="1"
                        />
                        {parseInt(product.pivot.quantity) >
                          originalQuantity && (
                          <span className="text-yellow-500 text-xs">
                            Exceeds stock ({originalQuantity})
                          </span>
                        )}
                      </div>
                    ) : (
                      product.pivot.quantity
                    )}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleProductRemove(product.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={onPageChange}
          containerClassName={"flex justify-center items-center space-x-2 mt-4"}
          pageClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
          previousClassName={
            "px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          }
          nextClassName={"px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"}
          activeClassName={"!bg-blue-500 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          forcePage={currentPage - 1}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
        />
      )}

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
              onClick={handleCancel}
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

export default OrderDetailForm;
