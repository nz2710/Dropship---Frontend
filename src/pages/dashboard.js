import { useState, useEffect } from "react";
import { API_URL2 } from "../utils/constant";
import { useCookies } from "react-cookie";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { LineChart } from '../components/chart/LineChart'
// import { DocsCallout } from 'src/components'

const DashBoard = () => {
  const [cookies] = useCookies(["token"]);
  const [errosMess, setErrosMess] = useState("");
  const [totalDepot, setTotalDepot] = useState(0); // Declare a state variable for total depot
  const [totalOrder, setTotalOrder] = useState(0); // Declare a state variable for total order
  const [totalVehicle, setTotalVehicle] = useState(0); // Declare a state variable for total vehicle
  const [totalPartner, setTotalPartner] = useState(0); // Declare a state variable for total partner
  const [totalProduct, setTotalProduct] = useState(0); // Declare a state variable for total product
  const handleLoadData = async () => {
    const url = new URL(`${API_URL2}/admin/dashboard/total-all`);
  
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
  const random = () => Math.round(Math.random() * 100)

  return (
    <div className='w-full'>
      <div className='mx-4 flex justify-between gap-10'>
        <div className='bg-white rounded-lg px-2 py-1 flex-grow'>
          <div>
            <p className='text-lg'>Total Depot</p>
            <h2 className='text-3xl font-bold mt-2'>{totalDepot}</h2>
          </div>
        </div>
        <div className='bg-white rounded-lg px-2 py-1 flex-grow'>
          <div>
            <p className='text-lg'>Total Vehicle</p>
            <h2 className='text-3xl font-bold mt-2'>{totalVehicle}</h2>
          </div>
        </div>
        <div className='bg-white rounded-lg px-2 py-1 flex-grow'>
          <div>
            <p className='text-lg'>Total Partner</p>
            <h2 className='text-3xl font-bold mt-2'>{totalPartner}</h2>
          </div>
        </div>
        <div className='bg-white rounded-lg px-2 py-1 flex-grow'>
          <div>
            <p className='text-lg'>Total Product</p>
            <h2 className='text-3xl font-bold mt-2'>{totalProduct}</h2>
          </div>
        </div>
        <div className='bg-white rounded-lg px-2 py-1 flex-grow'>
          <div>
            <p className='text-lg'>Total Order</p>
            <h2 className='text-3xl font-bold mt-2'>{totalOrder}</h2>
          </div>
        </div>
      </div>
      <div className='bg-white mt-4 mx-4 rounded-lg flex'>
        <div className='flex-1 p-4'>
          <p className='text-lg font-medium'>Summary Revenues</p>
          <div className='flex justify-end'>
            <div className='px-4 py-2 border border-gray-400 rounded-tl-lg rounded-bl-lg bg-blue-600 text-white'>
              Revenues
            </div>
            <div className='px-4 py-2 border border-gray-400'>
              Items Sold
            </div>
            <div className='px-4 py-2 border border-gray-400'>
              Total Earnings
            </div>
            <div className='px-4 py-2 border border-gray-400 rounded-tr-lg rounded-br-lg'>
              Cost
            </div>  
          </div>
          <div>
              <LineChart />
          </div>
        </div>
        <div className='p-4'>
            <p className='text-xl font-medium'>Summary</p>
            <div className='flex items-end '>
              <div>
                <p className=''>Total income</p>
                <p className='text-2xl font-semibold mb-0'>$56,365</p>
              </div>
              <div className='bg-green-500 text-white rounded-lg px-2 py-1'>
                23.6%
              </div>
            </div>
            <div className='flex items-end'>
              <div>
                <p className=''>Total income</p>
                <p className='text-2xl font-semibold mb-0'>$56,365</p>
              </div>
              <div className='bg-green-500 text-white rounded-lg px-2 py-1'>
                23.6%
              </div>
            </div>
            <div className='flex items-end'>
              <div>
                <p className=''>Total income</p>
                <p className='text-2xl font-semibold mb-0'>$56,365</p>
              </div>
              <div className='bg-green-500 text-white rounded-lg px-2 py-1'>
                23.6%
              </div>
            </div>
            <div className='flex items-end'>
              <div>
                <p className=''>Total income</p>
                <p className='text-2xl font-semibold mb-0'>192</p>
              </div>
              <div className='bg-green-500 text-white rounded-lg px-2 py-1'>
                23.6%
              </div>
            </div>
        </div>
      </div>
      <div className='mt-4 mx-4 flex gap-5'>
        <div className='bg-white p-4 rounded-lg'>
          <div className='flex justify-between'>
            <p className=''>Analytics</p>
            <div className='flex items-baseline'>
            <div className='mb-0 px-4 py-1 border border-gray-400 rounded-tl-lg rounded-bl-lg bg-blue-600 text-white'>
                Day
              </div>
              <div className='mb-0 px-4 py-1 border border-gray-400'>
                Week
              </div>
              <div className='mb-0 px-4 py-1 border border-gray-400 rounded-tr-lg rounded-br-lg'>
                Month
              </div> 
            </div>
          </div>
          <div>
              <h1>CHART</h1>
          </div>
        </div>
        <div className='flex-1'>
            <div className='bg-slate-300 py-2 px-2 text-lg font-semibold rounded-t-lg'>
              Top Products
            </div>
            <div className='bg-white p-4'>
              <table className='w-full'>
                <tr>
                  <td>
                    <div>
                      <p>Test</p>
                      <p>tessss</p>
                    </div>
                  </td>
                  <td>
                  <div>
                      <p>Test</p>
                      <p>tessss</p>
                    </div>
                  </td>
                  <td>
                  <div>
                      <p>Test</p>
                      <p>tessss</p>
                    </div>
                  </td>
                  <td>
                  <div>
                      <p>Test</p>
                      <p>tessss</p>
                    </div>
                  </td>
                  <td>
                  <div>
                      <p>Test</p>
                      <p>tessss</p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard