import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { API_URL } from '../utils/constant';
import { useCookies } from 'react-cookie';

function PartnerPage() {
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
    });
    const dataPerPage = 5;
    const [cookies] = useCookies(["token"]);

    const handlePageChange = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.address || !form.phone) {
          alert('Vui lòng điền đầy đủ thông tin.');
          return;
        }

        if(form.id){
            const response = await fetch(`${API_URL}/admin/partner/${form.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + cookies.token,
                },
                body: JSON.stringify(form),
            });
    
            if (response.status === 200) {
                alert('Cập nhật thành công');
                setShowForm(false);
                handleLoadData();
            } else {
                alert('Cập nhật thất bại');
            }
        } else {
            const response = await fetch(`${API_URL}/admin/partner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + cookies.token,
                },
                body: JSON.stringify(form),
            });
    
            if (response.status === 200) {
                alert('Đăng ký thành công');
                setShowForm(false);
                handleLoadData();
            } else {
                alert('Đăng ký thất bại');
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
          ...prevForm,
          [name]: value,
        }));
    };

    const handleUpdate = (item) => () => {
        setForm(item);
        setShowForm(true);
    }

    const handleAdd = () => {
        setForm({
            name: '',
            address: '',
            phone: '',
        });
        setShowForm(true);
    }

    const handleRemove = async (item) => {
        const response = await fetch(`${API_URL}/admin/partner/${item.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + cookies.token,
            }
        });
        if (response.status === 200) {
            alert('Xóa thành công');
            handleLoadData();
        } else {
            alert('Xóa thất bại');
        }
    }

    const handleLoadData = async () => {
        const response = await fetch(`${API_URL}/admin/partner?per_page=${dataPerPage}&page=${currentPage}&name=${searchName}&date=${searchDate}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + cookies.token,
            }
        });
        if (response.status === 200) {
            const body = (await response.json()).data;
            setCurrentPageData(body.data);
            setPageCount(body.last_page);
        } else {
            console.log("Fail", response);
        }
    }

    useEffect(() => {
        handleLoadData();
    }, [searchName, searchDate, currentPage]);

    return (
        <div className="flex justify-center bg-white mx-6 p-4 h-3/4">
            <div>
                <div className="mb-4 flex">
                    <div className="flex-1">
                        <input
                        type="text"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md mr-2"
                        />
                        <input
                        type="text"
                        placeholder="Search by date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md"
                        />
                    </div>
                    <div>
                        <button 
                            className="bg-slate-400 border-slate-600 border-2 border-solid text-white py-2 px-4 rounded-md"
                            onClick={handleAdd}
                        >   
                            Add
                        </button>   
                    </div>
                </div>
                <table className="min-w-full">
                    <thead>
                    <tr>
                    <th className="border px-4 py-2">STT</th>
                    <th className="border px-4 py-2">Tên</th>
                    {/* <th className="border px-4 py-2">Ngày đăng ký</th> */}
                    <th className="border px-4 py-2">Địa chỉ</th>
                    <th className="border px-4 py-2">Số điện thoại</th>
                    <th className="border px-4 py-2">Số lượng đơn hàng</th>
                    {/* <th className="border px-4 py-2">Chiết khấu</th> */}
                    <th className="border px-4 py-2">Doanh thu</th>
                    <th className="border px-4 py-2">Hoa hồng</th>
                    <th className="border px-4 py-2">Trạng thái</th>
                    <th className="border px-4 py-2">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentPageData.map((item) => (
                        <tr key={item.id}>
                        <td className="border px-4 py-2">{item.id}</td>
                        <td className="border px-4 py-2">{item.name}</td>
                        {/* <td className="border px-4 py-2">{item.register_date}</td> */}
                        <td className="border px-4 py-2">{item.address}</td>
                        <td className="border px-4 py-2">{item.phone}</td>
                        <td className="border px-4 py-2">{item.number_of_order}</td>
                        {/* <td className="border px-4 py-2">{item.discount}</td> */}
                        <td className="border px-4 py-2">{item.revenue}</td>
                        <td className="border px-4 py-2">{item.commission}</td>
                        <td className="border px-4 py-2">{item.status}</td>
                        <td className="border px-4 py-2">
                            <div className="flex gap-4">
                                <p className="text-yellow-500" onClick={handleUpdate(item)}>Edit</p>
                                <p className="text-red-600" onClick={() => handleRemove(item)}>Delete</p>
                            </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                />
            </div>
            {showForm && (
                <div className="fixed bg-slate-400 top-0" style={{ width: '100vw', height: '100vh' }}>
                    <form className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-32">
                        <h2 className="text-xl font-semibold mb-4">Đăng Ký Đối Tác</h2>
                        <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                            Tên đối tác
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={form.name}
                            onChange={handleFormChange}
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={form.address}
                            onChange={handleFormChange}
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={form.phone}
                            onChange={handleFormChange}
                        />
                        </div>
                        {
                            form.id && (
                                <div className="mb-4">
                                    <label htmlFor="register_date" className="block text-gray-700 font-medium mb-1">
                                        Ngày đăng ký
                                    </label>
                                    <input
                                        type="text"
                                        id="register_date"
                                        name="register_date"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        value={form.register_date}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            )
                        }
                        {
                            form.id && (
                                <div className="mb-4">
                                    <label htmlFor="discount" className="block text-gray-700 font-medium mb-1">
                                        Chiết khấu
                                    </label>
                                    <input
                                        type="text"
                                        id="discount"
                                        name="discount"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        value={form.discount}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            )
                        }
                        {
                            form.id && (
                                <div className="mb-4">
                                    <label htmlFor="status" className="block text-gray-700 font-medium mb-1">
                                        Trạng thái
                                    </label>
                                    <input
                                        type="text"
                                        id="status"
                                        name="status"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        value={form.status}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            )
                        }
                        <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md mb-4"
                        onClick={handleSubmit}
                        >
                            {form.id ? 'Cập nhật' : 'Đăng ký'}
                        </button>
                        <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                        onClick={() => setShowForm(false)}
                        >
                        Huỷ
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
export default PartnerPage;