import React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constant";

const Logindiv = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [, setCookie] = useCookies(["token"]);
  const [errosMess, setErrosMess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("storedUserName");
    const storedPassword = localStorage.getItem("storedPassword");

    if (storedUserName && storedPassword) {
      setUserName(storedUserName);
      setPassword(storedPassword);
    }
  }, []);
  async function login() {
    if (username === "" || password === "") {
      setErrosMess("Please enter username and password");
      return;
    }
    let response = await fetch(`/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setCookie("token", data.result.token);
  
      // Kiểm tra vai trò của người dùng
      const userRoles = data.result.user.roles;
      let redirectPath = "/admin/dashboard"; // Đường dẫn mặc định cho admin
  
      if (userRoles.some((role) => role.name === "partner")) {
        redirectPath = "/partner/dashboard"; // Đường dẫn cho partner
      }
  
      navigate(redirectPath);
    } else {
      setErrosMess("Login failed");
    }
  }
  return (
    // <div classNameName="login-div-container">
    //   <h2>Login</h2>
    //   <div classNameName="div-group">
    //     <label htmlFor="username">Username</label>
    //     <input type="text" id="username" name="username" value={username} onChange={(e) => setUserName(e.target.value)} />
    //   </div>
    //   <div classNameName="div-group">
    //     <label htmlFor="password">Password</label>
    //     <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //   </div>
    //   <button onClick={login} type='submit'>Login</button>
    // </div>
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/login"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          DropShipping
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <p className="text-red-700">{errosMess}</p>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your account
                </label>
                <input
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                {/* <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a> */}
              </div>
              <button
                onClick={login}
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logindiv;
