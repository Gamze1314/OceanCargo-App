import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

function Login() {
  const { logInCustomer } = useOutletContext();

  const [username, setUserName] = useState("");
  // const [password, setPassword] = useState("")

  function handleSubmit(e) {
    e.preventDefault();

    const loginData = {
      username: username
    };
// authentication API call
    logInCustomer(loginData);

  }

  // center form with flexbox and grid
  const formClass = "bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"

  return (
    <div className="flex justify-center items-center min-h">
      <header>{/* Save space for NavBar */}</header>
      <main>
        <h1>Login</h1>
        <form className={formClass} onSubmit={handleSubmit}>
          <div>
            <label for="username">Username </label>
            <input
              className="bg-gray-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-72 md:w-72 sm:w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-blue-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4"
              id="username"
              type="text"
              name="username"
              placeholder="Please enter your username..."
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          {/* <br />
          <div>
            <label for="password">Password: </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={"state"}
              onChange={(e) => console.log(e.target.value)}
              required
            />
          </div>
          <br /> */}
          <button
            className="bg-gray-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 md:w-50 sm:w-32 p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-blue-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-7"
            type="submit"
          >
            Log in
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;
