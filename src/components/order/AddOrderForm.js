import { useState, useEffect } from "react";
import { API_URL2 } from "../../utils/constant";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function AddOrderForm({ onClose, onOrderAdded }) {
  const [partners, setPartners] = useState([]);
  const [address, setAddress] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [massOfOrder, setMassOfOrder] = useState(0);
  const [timeService, setTimeService] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [searchPartner, setSearchPartner] = useState("");
const [searchProduct, setSearchProduct] = useState("");
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL2}/admin/product`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      if (response.status === 200) {
        const body = (await response.json()).data;
        setProducts(body.data);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch(`${API_URL2}/admin/getAll`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      if (response.status === 200) {
        const body = (await response.json());
        setPartners(body.data);
      } else {
        throw new Error("Failed to fetch partners");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const filteredPartners = partners.filter((partner) =>
    `${partner.id} - ${partner.name}`.toLowerCase().includes(searchPartner.toLowerCase())
  );
  
  const filteredProducts = products.filter((product) =>
    `${product.name} - ${product.sku}`.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const handleProductSelect = (productId) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      setSelectedProducts([
        ...selectedProducts,
        { ...selectedProduct, quantity: 1, price: selectedProduct.price },
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
      selectedProducts.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  const handlePriceChange = (productId, price) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product.id === productId ? { ...product, price } : product
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL2}/admin/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify({
          address,
          partner_id: parseInt(partnerId),
          customer_name: customerName,
          mass_of_order: massOfOrder,
          time_service: timeService,
          products: selectedProducts.map(({ id, quantity, price }) => ({
            id,
            quantity,
            price,
          })),
        }),
      });
      if (response.status === 200) {
        toast.success("Order added successfully");
        onOrderAdded();
        onClose();
      } else {
        throw new Error("Failed to add order");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Order</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="mb-4">
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
        {/* Partner selection */}
        <div className="mb-4">
        <label htmlFor="partnerId" className="block mb-1">
          Partner
        </label>
        <input
          type="text"
          id="searchPartner"
          value={searchPartner}
          onChange={(e) => setSearchPartner(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-2"
          placeholder="Search partner"
        />
        <select
          id="partnerId"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          required
        >
          <option value="">Select a partner</option>
          {filteredPartners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.id} - {partner.name}
            </option>
          ))}
        </select>
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
          <label htmlFor="massOfOrder" className="block mb-1">
            Mass of Order
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
        <div className="mb-4">
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
        </div>
        {/* Product selection */}
        <div className="mb-4">
        <label htmlFor="products" className="block mb-1">
          Products
        </label>
        <input
          type="text"
          id="searchProduct"
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-2"
          placeholder="Search product"
        />
        <select
          id="products"
          onChange={(e) => handleProductSelect(parseInt(e.target.value))}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="">Select a product</option>
          {filteredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.sku}
            </option>
          ))}
        </select>
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
