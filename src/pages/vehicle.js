import { useState } from "react";
import ReactPaginate from "react-paginate";

function Vehicle() {
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const dataPerPage = 5;
    const data = [
        { id: 1, name: "Kia", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 2, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 3, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 4, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 5, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 6, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 7, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 8, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 9, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
        { id: 10, name: "Mercedes", date: "30", col1: "300.000", col2: "12km/h", col3: "Lam", col4: "Xe may", col5: "Ready" },
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
        <div className="flex justify-center bg-white p-3 m-3 rounded-md">
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
                    <th className="border px-4 py-2">Tên xe</th>
                    <th className="border px-4 py-2">Sức chứa(kg/m3)</th>
                    {/* <th className="border px-4 py-2">Thời gian hoạt động</th> */}
                    <th className="border px-4 py-2">Vận tốc trung bình(km/h)</th>
                    <th className="border px-4 py-2">Tên lái xe</th>
                    <th className="border px-4 py-2">Loại xe</th>
                    <th className="border px-4 py-2">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentPageData.map((item) => (
                        <tr key={item.id}>
                        <td className="border px-4 py-2">{item.id}</td>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">{item.date}</td>
                        {/* <td className="border px-4 py-2">{item.col1}</td> */}
                        <td className="border px-4 py-2">{item.col2}</td>
                        <td className="border px-4 py-2">{item.col3}</td>
                        <td className="border px-4 py-2">{item.col4}</td>
                        <td className="border px-4 py-2">
                            <p className="text-white p-1 bg-green-500 rounded-lg text-center">{item.col5}</p>
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
export default Vehicle;