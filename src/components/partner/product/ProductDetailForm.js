import React from "react";
import { formatNumber } from "../../../utils/commonUtils";

function ProductDetailForm({ product, onClose }) {

  const renderInfoItem = (label, value) => (
    <div className="mb-4">
      <span className="font-semibold">{label}:</span>{" "}
      {value}
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
          )}
          {/* {renderInfoItem(
            "Cost",
            `${formatNumber(product.cost)} VND`,
          )} */}

          {renderInfoItem(
            "Description",
            product.description,
          )}
          {renderInfoItem(
            "Status",
            getStatusBadge(product.status),
          )}
          {renderInfoItem(
            "Image",
            <img
              src={`http://localhost:82/images/products/${product.image}`}
              alt={product.name}
              className="w-20 h-20 object-cover"
            />
          )}
        </div>
        <div>
          {renderInfoItem("SKU", product.sku)}

          {renderInfoItem(
            "Quantity",
            product.quantity,
          )}
          {renderInfoItem(
            "Price",
            `${formatNumber(product.price)} VND`,
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
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </>
      </div>
    </div>
  );
}

export default ProductDetailForm;
