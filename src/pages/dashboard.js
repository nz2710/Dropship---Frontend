import { useState, useEffect } from "react";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from "@coreui/react";
import MiniLineChart from "../components/chart/MiniLineChart";
import AreaChart from "../components/chart/AreaChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { DocsCallout } from 'src/components'

const DashBoard = () => {
  const [cookies] = useCookies(["token"]);
  const [errosMess, setErrosMess] = useState("");
  const [totalDepot, setTotalDepot] = useState(0); // Declare a state variable for total depot
  const [totalOrder, setTotalOrder] = useState(0); // Declare a state variable for total order
  const [totalVehicle, setTotalVehicle] = useState(0); // Declare a state variable for total vehicle
  const [totalPartner, setTotalPartner] = useState(0); // Declare a state variable for total partner
  const [totalProduct, setTotalProduct] = useState(0); // Declare a state variable for total product
  const [revenueData, setRevenueData] = useState([]);
  const [itemsSoldData, setItemsSoldData] = useState([]);
  const [TopPartnerData, setTopPartnerData] = useState([]);
  const [TopProductData, setTopProductData] = useState([]);
  const [activeTab, setActiveTab] = useState("revenues");
  const [filterType, setFilterType] = useState("month");
  const [metric_type_partner, setMetricTypePartner] = useState("revenue");
  const [metric_type_product, setMetricTypeProduct] = useState("sale");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const generateFixedData = (numPoints, values) => {
    const data = [];
    for (let i = 0; i < numPoints; i++) {
      data.push({
        name: `Point ${i}`,
        value: values[i],
      });
    }
    return data;
  };

  const confirmedOrdersData = generateFixedData(5, [10, 50, 25, 70, 90]);

  const handleMetricPartnerTypeChange = (type) => {
    setMetricTypePartner(type);
    fetchTopPartner(selectedYear, filterType, selectedMonth, type);
  };

  const handleMetricProductTypeChange = (type) => {
    setMetricTypeProduct(type);
    fetchTopProduct(selectedYear, filterType, selectedMonth, type);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);

    if (event.target.value === "year") {
      fetchData(selectedYear, event.target.value);
    } else {
      fetchData(selectedYear, event.target.value, selectedMonth);
    }
  };

  const handleYearChange = (date) => {
    const selectedYear = date.getFullYear();
    setSelectedYear(selectedYear);
    fetchData(selectedYear, filterType);
  };

  const handleMonthChange = (date) => {
    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth() + 1;

    setSelectedYear(selectedYear);
    setSelectedMonth(selectedMonth);

    fetchData(selectedYear, "month", selectedMonth);
  };

  const fetchTopPartner = async (
    year,
    filterType,
    month,
    metric_type_partner
  ) => {
    try {
      let url = `${API_URL2}/api/admin/dashboard/top-partners?year=${year}&filter_type=${filterType}&metric_type=${metric_type_partner}`;
      if (filterType === "month" && month) {
        url += `&month=${month}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTopPartnerData(data.data);
      } else {
        console.error("Failed to fetch items sold data");
      }
    } catch (error) {
      console.error("Error fetching items sold data:", error);
    }
  };
  const fetchTopProduct = async (
    year,
    filterType,
    month,
    metric_type_product
  ) => {
    try {
      let url = `${API_URL2}/api/admin/dashboard/top-products?year=${year}&filter_type=${filterType}&metric_type=${metric_type_product}`;
      if (filterType === "month" && month) {
        url += `&month=${month}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTopProductData(data.data);
      } else {
        console.error("Failed to fetch items sold data");
      }
    } catch (error) {
      console.error("Error fetching items sold data:", error);
    }
  };
  useEffect(() => {
    fetchTopPartner(
      selectedYear,
      filterType,
      selectedMonth,
      metric_type_partner
    );
  }, [selectedYear, filterType, selectedMonth, metric_type_partner]);

  useEffect(() => {
    fetchTopProduct(
      selectedYear,
      filterType,
      selectedMonth,
      metric_type_product
    );
  }, [selectedYear, filterType, selectedMonth, metric_type_product]);

  const fetchRevenueData = async (year, filterType, month) => {
    try {
      let url = `${API_URL2}/api/admin/dashboard/revenue-summary?year=${year}&filter_type=${filterType}`;
      if (filterType === "month" && month) {
        url += `&month=${month}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRevenueData(data.data);
      } else {
        console.error("Failed to fetch revenue data");
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };
  const fetchItemsSoldData = async (year, filterType, month) => {
    try {
      let url = `${API_URL2}/api/admin/dashboard/itemsold-summary?year=${year}&filter_type=${filterType}`;
      if (filterType === "month" && month) {
        url += `&month=${month}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });
      const data = await response.json();
      if (data.success) {
        setItemsSoldData(data.data);
      } else {
        console.error("Failed to fetch items sold data");
      }
    } catch (error) {
      console.error("Error fetching items sold data:", error);
    }
  };
  const fetchData = async (year, filterType, month) => {
    fetchRevenueData(year, filterType, month);
    if (activeTab === "itemsSold") {
      fetchItemsSoldData(year, filterType, month);
    }
  };
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetchData(currentYear, filterType);
  }, [filterType]);
  // console.log(confirmedOrdersData);
  // Tương tự cho các loại đơn hàng khác
  const handleLoadData = async () => {
    const url = new URL(`${API_URL2}/api/admin/dashboard/total-all`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + cookies.token,
      },
    });
    if (response.status === 200) {
      const body = await response.json();
      setTotalDepot(body.totalDepots);
      setTotalOrder(body.totalOrders);
      setTotalVehicle(body.totalVehicles);
      setTotalPartner(body.totalPartners);
      setTotalProduct(body.totalProduct);
    } else {
      setErrosMess("Failed to fetch data");
    }
  };

  useEffect(() => {
    handleLoadData(); // Call the function when the component mounts
  }, []);

  return (
    <div className="w-full">
      <div className=" mx-4 flex justify-between h-36 ">
        <div className="bg-white rounded-lg pl-4 pr-2 pb-4 shadow-md flex items-center">
          <div className="flex-grow">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Total Depot
            </p>
            <h2 className="text-3xl font-bold">{totalDepot}</h2>
          </div>
          <div className="ml-6" style={{ width: "100px", height: "5px" }}>
            <MiniLineChart data={confirmedOrdersData} color="#4caf50" />
          </div>
        </div>
        <div className="bg-white rounded-lg pl-4 pr-2 pb-4  shadow-md flex items-center">
          <div className="flex-grow">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Total Vehicle
            </p>
            <h2 className="text-3xl font-bold">{totalVehicle}</h2>
          </div>
          <div className="ml-6" style={{ width: "100px", height: "10px" }}>
            <MiniLineChart data={confirmedOrdersData} color="#4caf50" />
          </div>
        </div>
        <div className="bg-white rounded-lg pl-4 pr-2 pb-4  shadow-md flex items-center">
          <div className="flex-grow">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Total Partner
            </p>
            <h2 className="text-3xl font-bold">{totalPartner}</h2>
          </div>
          <div className="ml-6" style={{ width: "100px", height: "10px" }}>
            <MiniLineChart data={confirmedOrdersData} color="#4caf50" />
          </div>
        </div>
        <div className="bg-white rounded-lg pl-4 pr-2 pb-4  shadow-md flex items-center">
          <div className="flex-grow">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Total Product
            </p>
            <h2 className="text-3xl font-bold">{totalProduct}</h2>
          </div>
          <div className="ml-6" style={{ width: "100px", height: "10px" }}>
            <MiniLineChart data={confirmedOrdersData} color="#4caf50" />
          </div>
        </div>
        <div className="bg-white rounded-lg pl-4 pr-2 pb-4  shadow-md flex items-center">
          <div className="flex-grow">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Total Order
            </p>
            <h2 className="text-3xl font-bold">{totalOrder}</h2>
          </div>
          <div className="ml-6" style={{ width: "100px", height: "10px" }}>
            <MiniLineChart data={confirmedOrdersData} color="#4caf50" />
          </div>
        </div>
      </div>
      {/* ... */}
      {/* Thay đổi kiểu chữ và màu sắc của nút radio */}
      <div className="mx-4 mt-4 flex justify-end">
        <div className="flex items-center">
          <label className="mr-2 text-gray-700 font-semibold">
            <input
              type="radio"
              value="year"
              checked={filterType === "year"}
              onChange={handleFilterTypeChange}
              className="mr-1 text-indigo-600"
            />
            Year
          </label>
          <label className="text-gray-700 font-semibold">
            <input
              type="radio"
              value="month"
              checked={filterType === "month"}
              onChange={handleFilterTypeChange}
              className="mr-1 text-indigo-600"
            />
            Month
          </label>
        </div>
      </div>
      {/* Thay đổi kiểu chữ và màu sắc của DatePicker */}
      {filterType === "year" ? (
        <div className="mx-4 mt-2 flex justify-end">
          <div className="flex items-center">
            <DatePicker
              selected={new Date(selectedYear, 0)}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-gray-700 font-semibold"
            />
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-2 flex justify-end">
          <div className="flex items-center">
            <DatePicker
              selected={new Date(selectedYear, selectedMonth - 1)}
              onChange={handleMonthChange}
              showMonthYearPicker
              dateFormat="MM/yyyy"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-gray-700 font-semibold"
            />
          </div>
        </div>
      )}
      {/* ... */}
      {/* Thay đổi kiểu chữ và màu sắc của tiêu đề và tab */}
      <div className="bg-white mt-4 mx-4 rounded-lg flex">
        <div className="flex-1 pt-4 pl-4 pr-4 pb-1">
          <p className="text-lg font-semibold text-gray-800">
            Summary Revenues
          </p>
          <div className="flex justify-end pr-8">
            <div
              className={`px-4 py-2 border border-gray-400 rounded-tl-lg rounded-bl-lg cursor-pointer ${
                activeTab === "revenues"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 font-semibold"
              }`}
              onClick={() => setActiveTab("revenues")}
            >
              Revenues
            </div>
            <div
              className={`px-4 py-2 border border-gray-400 cursor-pointer ${
                activeTab === "itemsSold"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 font-semibold"
              }`}
              onClick={() => setActiveTab("itemsSold")}
            >
              Items Sold
            </div>
            <div className="px-4 py-2 border border-gray-400 text-gray-700 font-semibold">
              Profit
            </div>
            <div className="px-4 py-2 border border-gray-400 rounded-tr-lg rounded-br-lg text-gray-700 font-semibold">
              Cost
            </div>
          </div>
          <div>
            {activeTab === "revenues" ? (
              <AreaChart
                data={revenueData}
                filterType={filterType}
                dataKey="revenue"
              />
            ) : (
              <AreaChart
                data={itemsSoldData}
                filterType={filterType}
                dataKey="item sold"
              />
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="text-xl font-semibold text-gray-800">Summary</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total income</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  $56,365
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total income</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  $56,365
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-700 font-semibold">Total income</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  $56,365
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
            <div className="flex items-end">
              <div>
                <p className="text-gray-700 font-semibold">Total income</p>
                <p className="text-2xl font-bold text-indigo-600 mb-0">
                  $56,365
                </p>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-1 ml-2">
                23.6%
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Thay đổi kiểu chữ và màu sắc của tiêu đề và tab */}
      <div className="mt-4 mx-4 flex gap-5">
        <div className="flex-1">
          <div className="flex bg-indigo-200 justify-between rounded-t-lg">
            <div className=" py-2 px-2 text-lg font-semibold text-gray-800 ">
              Top Partners
            </div>
            <div className=" py-2 px-2 flex items-baseline">
              <div
                className={`mb-0 px-4 py-1 border border-gray-400 rounded-tl-lg rounded-bl-lg cursor-pointer ${
                  metric_type_partner === "amount"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 font-semibold"
                }`}
                onClick={() => handleMetricPartnerTypeChange("amount")}
              >
                Amount
              </div>
              <div
                className={`mb-0 px-4 py-1 border border-gray-400 cursor-pointer ${
                  metric_type_partner === "revenue"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 font-semibold"
                }`}
                onClick={() => handleMetricPartnerTypeChange("revenue")}
              >
                Revenue
              </div>
            </div>
          </div>
          <div className="bg-white p-4">
            <table className="w-full text-sm text-left text-gray-500">
              {/* <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Partner ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Partner Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {metric_type === "amount"
                      ? "Total Amount"
                      : "Total Revenue"}
                  </th>
                </tr>
              </thead> */}
              <tbody>
                {TopPartnerData.map((partner) => (
                  <tr key={partner.partner_id} className="bg-white border-b">
                    <td className="px-6 py-4">{partner.partner_id}</td>
                    <td className="px-6 py-4">{partner.partner_name}</td>
                    <td className="px-6 py-4">{parseFloat(partner.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* ... */}
        <div className="flex-1">
          <div className="flex bg-indigo-200 justify-between rounded-t-lg">
            <div className=" py-2 px-2 text-lg font-semibold text-gray-800 ">
              Top Products
            </div>
            <div className=" py-2 px-2 flex items-baseline">
              <div
                className={`mb-0 px-4 py-1 border border-gray-400 rounded-tl-lg rounded-bl-lg cursor-pointer ${
                  metric_type_partner === "quantity"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 font-semibold"
                }`}
                onClick={() => handleMetricProductTypeChange("quantity")}
              >
                Quantity
              </div>
              <div
                className={`mb-0 px-4 py-1 border border-gray-400 cursor-pointer ${
                  metric_type_partner === "sale"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 font-semibold"
                }`}
                onClick={() => handleMetricProductTypeChange("sale")}
              >
                Sale
              </div>
            </div>
          </div>
          <div className="bg-white p-4">
            <table className="w-full text-sm text-left text-gray-500">
              {/* <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total Revenue
                  </th>
                </tr>
              </thead> */}
              <tbody>
                {TopProductData.map((product) => (
                  <tr key={product.product_id} className="bg-white border-b">
                    <td className="px-6 py-4">{product.product_id}</td>
                    <td className="px-6 py-4">{product.product_name}</td>
                    <td className="px-6 py-4">{parseFloat(product.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
