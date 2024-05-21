import { useState, useEffect } from 'react';
import { API_URL } from '../utils/constant';
import { useCookies } from 'react-cookie';
import ReactPaginate from 'react-paginate';

const User = () => {
    const [cookies] = useCookies(["token"]);
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirm, setPasswordConfirm] = useState("");
    const [role, setRole] = useState("");
    const [errosMess, setErrosMess] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [currentPageData, setCurrentPageData] = useState([]);
    const dataPerPage = 5;
    const [showForm, setShowForm] = useState(false);

    const handlePageChange = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage + 1);
      };

    const handleAdd = () => {
        setShowForm(true);
    }

    async function addUser() {
        const response = await fetch(`${API_URL}/admin/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookies.token}`,
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                password_confirmation: password_confirm,
                role_id: role
            }),
        });

        if (response.status === 200) {
            const data = await response.json();
            setErrosMess(data.mes)
        } else {
            setErrosMess("Create user failed");
        }
    }
    const handleBan = async (item) => {
        const response = await fetch(`${API_URL}/admin/ban/user/${item.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cookies.token,
            }
        });
        if (response.status === 200) {
            alert('Ban thành công');
            handleLoadData();
        } else {
            alert('Ban thất bại');
        }
    }
    const handleUnBan = async (item) => {
        const response = await fetch(`${API_URL}/admin/unban/user/${item.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cookies.token,
            }
        });
        if (response.status === 200) {
            alert('Unban thành công');
            handleLoadData();
        } else {
            alert('Unban thất bại');
        }
    }
    const handleLoadData = async () => {
        const response = await fetch(`${API_URL}/admin/users?pageSize=${dataPerPage}&page=${currentPage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cookies.token,
            }
        });
        if (response.status === 200) {
            const body = (await response.json()).result;
            console.log(body);
            setCurrentPageData(body.data);
            setPageCount(body.last_page);
        } else {
            console.log("Fail", response);
        }
    }

    useEffect(() => {
        handleLoadData();
    }, [currentPage]);

    return (
        <div className="bg-white w-4/5 m-auto pb-5 rounded-md shadow-lg">
            {!showForm && (
            <div className='p-4'>
                <div className="mb-4 flex justify-end">
                    <div className=''>
                        <button
                            className="bg-blue-600 text-white py-2 px-4 rounded-md"
                            onClick={handleAdd}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Username</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Role</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{item.id}</td>
                                <td className="border px-4 py-2">{item.username}</td>
                                <td className="border px-4 py-2">{item.email}</td>
                                {
                                    item.roles.length > 0 ?
                                    item.roles.map((role) => (
                                        <td key={role.id} className="border px-4 py-2">{role.name}</td>       
                                    ))
                                    :
                                    <td className="border px-4 py-2">{role.name}</td>
                                }
                                <td className="border px-4 py-2">
                                    <div className="flex gap-4">
                                        {   item.status === 1 ?
                                            <p className="text-red-600 cursor-pointer" onClick={() => handleBan(item)}>Ban</p>
                                            :
                                            <p className="text-green-600 cursor-pointer" onClick={() => handleUnBan(item)}>Unban</p>
                                        }
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
                    forcePage={currentPage - 1}
                />
            </div>)}
            {showForm && (
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Create User</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
                                onChange={(e) => setUserName(e.target.value)}
                                value={username}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
                                type="password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password confirm</label>
                            <input
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                value={password_confirm}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
                                type="password"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select a role</option>
                            <option value={1}>Admin</option>
                            <option value={2}>Partner</option>
                            <option value={3}>Driver</option>
                        </select>
                    </div>
                    <div className='flex justify-between mt-6'>
                        <button onClick={() => setShowForm(false)} className='py-2 px-4 bg-gray-600 text-white rounded-md'>Back</button>
                        <button onClick={addUser} className='py-2 px-4 bg-blue-600 text-white rounded-md'>Add User</button>
                    </div>
                    <p className='mt-4 text-base text-red-600'>
                        {errosMess}
                    </p>
                </div>
            )}
        </div>
    );
}

export default User;