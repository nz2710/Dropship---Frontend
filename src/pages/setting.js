
function Settings() {
    return (
        <div className="bg-white w-4/5 m-auto pb-5 rounded-md">
            <div className="flex justify-between border-b border-gray-300 p-3">
                <p>Cấu hình thuật toán</p>
                <button className="w-20 bg-green-500 text-white rounded-md">Next</button>
            </div>
            <div className="m-4 border border-gray-400 rounded-md">
                <p className="border-b border-gray-300 p-3">Cơ bản</p>
                <div className="m-4">
                    <div className="flex gap-5 mb-3">
                        <div>
                            <p>Giới hạn giờ chạy</p>
                            <label class="inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" />
                            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                        <div>
                            <p>Thời gian chạy xe tối đa trong một chuyến(giờ)</p>
                            <input className="outline-none p-1 border border-gray-300" />
                        </div>
                        <div>
                            <p>Giới hạn quãng đường</p>
                            <label class="inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" />
                            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                        <div>
                            <p>Quãng đường tối đa (km)</p>
                            <input className="outline-none p-1 border border-gray-300" />
                        </div>
                    </div>
                    <div className="flex gap-5 align-middle">
                        <div>
                            <p>Giới hạn số lượng xe</p>
                            <label class="inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" />
                            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                        <div>
                            <p>Giới hạn số lượng xe</p>
                            <input className="outline-none p-1 border border-gray-300" />
                        </div>
                        {/* <div>
                            <p>Cho phép vi phạm khung thời gian</p>
                            <label class="inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" />
                            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            </label>
                        </div> */}
                        {/* <div>
                            <p>Tự động loại trừ hàng hóa</p>
                            <label class="inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" />
                            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            </label>
                        </div> */}
                    </div>
                </div>
                
                <p className="border-b border-t border-gray-300 p-3">Nâng cao</p>
                <div className="m-4">
                    <div className="flex gap-5 mb-3">
                        <div>
                            <p>kích thước quần thể(cá thể)</p>
                            <input className="outline-none p-2 border border-gray-300" />
                        </div>
                        <div>
                            <p>kích thước tập tính hóa(cá thể)</p>
                            <input className="outline-none p-2 border border-gray-300" />
                        </div>
                    </div>
                    <div className="flex gap-5 mb-3 align-middle">
                        <div>
                            <p>Số thế hệ tối đa được sinh ra</p>
                            <input className="outline-none p-2 border border-gray-300" />
                        </div>
                        <div>
                            <p>Số thể hệ tối đa không cải thiện</p>
                            <input className="outline-none p-2 border border-gray-300" />
                        </div>
                    </div>
                    <div className="flex gap-5 align-middle mb-3">
                        <div>
                            <p>Xác suất Lai ghép</p>
                            <input className="outline-none p-2 border border-gray-300" />
                        </div>
                        <div>
                            <p>Xác xuất Đột biến</p>
                            <input className="outline-none p-2 border border-gray-300" />
                        </div>
                    </div>
                    <div className="flex gap-5 align-middle mb-3">
                        <div>
                            <p>Số cá thể được chọn</p>
                            <input className="outline-none p-2 border border-gray-300" />
                        </div>
                        <div>
                            <p>Kích thước tập chọn lọc</p>
                            <input className="outline-none p-2 border border-gray-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;