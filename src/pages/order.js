import { useState } from "react";
import ReactPaginate
 from "react-paginate";
function OrderPage() {
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const dataPerPage = 5;
    const data = [
        { id: 1, name: "John Doe", date: "2023-03-15", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
        { id: 2, name: "Jane Smith", date: "2023-03-16", col1: "Data 1", col2: "Data 2", col3: "Data 3", col4: "Data 4", col5: "Data 5", col6: "Data 6", col7: "Data 7", col8: "Data 8", col9: "Data 9" },
    ];
    const filteredData = data.filter(
        (item) =>
        item.name.toLowerCase().includes(searchName.toLowerCase()) &&
        item.date.includes(searchDate)
    );

    const offset = currentPage * dataPerPage;

    const currentPageData = filteredData.slice(offset, offset + dataPerPage);

    const pageCount = Math.ceil(filteredData.length / dataPerPage);

    const handlePageChange = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };


    return (
        <div className="flex justify-center bg-white mx-6 p-4 h-3/4">
            <div>
                <div className="mb-4 flex">
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
                <table className="min-w-full">
                    <thead>
                    <tr>
                    <th className="border px-4 py-2">STT</th>
                    <th className="border px-4 py-2">Tên</th>
                    <th className="border px-4 py-2">Ngày đăng ký</th>
                    <th className="border px-4 py-2">Địa chỉ</th>
                    <th className="border px-4 py-2">Số điện thoại</th>
                    <th className="border px-4 py-2">Số lượng đơn hàng</th>
                    <th className="border px-4 py-2">Chiết khấu</th>
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
                        <td className="border px-4 py-2">{item.date}</td>
                        <td className="border px-4 py-2">{item.col1}</td>
                        <td className="border px-4 py-2">{item.col2}</td>
                        <td className="border px-4 py-2">{item.col3}</td>
                        <td className="border px-4 py-2">{item.col4}</td>
                        <td className="border px-4 py-2">{item.col5}</td>
                        <td className="border px-4 py-2">{item.col6}</td>
                        <td className="border px-4 py-2">{item.col7}</td>
                        <td className="border px-4 py-2">
                            <div className="flex gap-4">
                                <p className="text-blue-600">Detail</p>
                                <p className="text-yellow-500">Edit</p>
                                <p className="text-red-600">Delete</p>
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
        </div>
    )
}
export default OrderPage;