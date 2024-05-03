import { useState } from 'react';
import { API_URL } from '../utils/constant';
import { useCookies } from 'react-cookie';

const User = () => {
    const [cookies] = useCookies(["token"]);
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirm, setPasswordConfirm] = useState("");
    const [role, setRole] = useState("");
    const [errosMess, setErrosMess] = useState("");

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

    return (
        <div className="bg-white w-4/5 m-auto pb-5 rounded-md shadow-lg">
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
                <div className='flex justify-end mt-6'>
                    <button onClick={addUser} className='py-2 px-4 bg-blue-600 text-white rounded-md'>Add User</button>
                </div>
            </div>
            <p className='mt-4 text-base text-green-600'>
                {errosMess}
            </p>
        </div>
    );
}

export default User;