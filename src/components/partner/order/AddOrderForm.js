import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Select from "react-select";

function AddOrderForm({ onClose, onOrderAdded }) {
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [massOfOrder, setMassOfOrder] = useState(0);
  // const [timeService, setTimeService] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const goongApiKey = "sAOS9801oH13hSZORoMX3EZy2WzCbRSPWakuMjv9";
  const [cookies] = useCookies(["token"]);

  const handleAddressInput = async (event) => {
    const input = event.target.value;
    if (input.length > 2) {
      let response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${goongApiKey}&input=${encodeURIComponent(
          input
        )}`
      );
      const data = await response.json();
      setSuggestions(data.predictions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.description);
    setSuggestions([]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response = await fetch(`/api/management/partner/getProducts`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
        if (response.status === 200) {
          const body = await response.json();
          setProducts(body.data);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    };
    fetchProducts();
  }, [cookies.token]);

  const productOptions = products.map((product) => ({
    value: product.id,
    label: `${product.name} - ${product.sku} (Stock: ${product.quantity})`,
  }));

  const handleProductFilter = (option, inputValue) => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  const handleProductSelect = (productId) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      setSelectedProducts([
        ...selectedProducts,
        {
          ...selectedProduct,
          quantity: 1,
          price: selectedProduct.price,
          originalQuantity: selectedProduct.quantity,
          originalPrice: selectedProduct.price,
        },
      ]);
    }
  };

  const handleProductRemove = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== productId)
    );
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((product) => {
        if (product.id === productId) {
          const newQuantity = Math.max(1, quantity);
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const handlePriceChange = (productId, price) => {
    setSelectedProducts(
      selectedProducts.map((product) => {
        if (product.id === productId) {
          const newPrice = Math.max(0, price);
          return { ...product, price: newPrice };
        }
        return product;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`/api/management/partner/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify({
          address,
          customer_name: customerName,
          phone,
          mass_of_order: massOfOrder,
          // time_service: timeService,
          products: selectedProducts.map(({ id, quantity, price }) => ({
            id,
            quantity,
            price,
          })),
        }),
      });
      if (response.status === 200) {
        toast.success("Order added successfully with Waiting status");
        onOrderAdded();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add order");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Order</h2>
      <p className="mb-4 text-gray-600">
        Note: The order will be created with a 'Waiting' status.
      </p>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="mb-4 relative">
          <label htmlFor="address" className="block mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              handleAddressInput(e);
            }}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="customerName" className="block mb-1">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="massOfOrder" className="block mb-1">
            Weight
          </label>
          <input
            type="number"
            id="massOfOrder"
            step="0.01"
            value={massOfOrder}
            onChange={(e) => setMassOfOrder(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        {/* <div className="mb-4">
          <label htmlFor="timeService" className="block mb-1">
            Time Service
          </label>
          <input
            type="number"
            id="timeService"
            value={timeService}
            onChange={(e) => setTimeService(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div> */}
        {/* Product selection */}
        <div className="mb-4">
          <label htmlFor="products" className="block mb-1">
            Products
          </label>
          <Select
            id="products"
            onChange={(selectedOption) =>
              handleProductSelect(selectedOption.value)
            }
            options={productOptions}
            filterOption={handleProductFilter}
            placeholder="Search product"
          />
        </div>
        {/* Selected products */}
        {selectedProducts.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">Selected Products</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="border border-gray-300 p-2 rounded w-full"
                        min="1"
                        required
                      />
                      {product.quantity > product.originalQuantity && (
                        <span className="text-yellow-500 text-xs">
                          Exceeds stock ({product.originalQuantity})
                        </span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) =>
                          handlePriceChange(
                            product.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="border border-gray-300 p-2 rounded w-full"
                        min="0"
                        required
                      />
                      {product.price < product.originalPrice && (
                        <span className="text-yellow-500 text-xs">
                          Below original price ({product.originalPrice})
                        </span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        type="button"
                        onClick={() => handleProductRemove(product.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddOrderForm;
