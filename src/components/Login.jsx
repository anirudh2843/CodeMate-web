import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (username, password) => {
    try {
      const res = await axios.post(BASE_URL + "/login", { username, password }, {
        withCredentials: true, // Make sure credentials are sent (cookies or tokens)
      });
  
      if (res.status === 200) {
        // Handle successful login (e.g., save token or session info)
        console.log("Login successful!", res.data);
      } else {
        console.log("Login failed!", res);
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("Login failed, please try again.");
    }
  };
  

  const handleSignUp = async () => {
    if (!firstName || !lastName || !emailId || !password) {
      setError("All fields are required!");
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!!!");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "SignUp"}
          </h2>
          <div>
            {!isLoginForm && (
              <>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">FirstName</legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input"
                    placeholder="Enter the FirstName"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">LastName</legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input"
                    placeholder="Enter the lastName"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </>
            )}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email ID</legend>
              <input
                type="email"
                value={emailId}
                className="input"
                placeholder="Enter the Email"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                value={password}
                className="input"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "SignUp"}
            </button>
          </div>
          <button onClick={() => setLoginForm((value) => !value)}>
            {isLoginForm
              ? "New User? SignUp Here"
              : "Existing User? Login Here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
