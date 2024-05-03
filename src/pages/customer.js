

function Customer() {
    return (
        <div className="bg-white w-4/5 m-auto pb-5 rounded-md">
            <div className="p-2">
                <div>Create User</div>
                <div className="flex">
                <div className="flex-1">
                        <p>Username</p>
                        <input className="outline-none p-2 border border-gray-300" />
                </div>
                <div className="flex-1">
                        <p>Email</p>
                        <input className="outline-none p-2 border border-gray-300" />
                    </div>
                </div>
                <div className="flex">
                    <div className="flex-1">
                            <p>Password</p>
                            <input className="outline-none p-2 border border-gray-300" />
                    </div>
                    <div className="flex-1">
                            <p>Password confirm</p>
                            <input className="outline-none p-2 border border-gray-300" />
                    </div>  
                </div>
            </div>
        </div>
    );
}
export default Customer;