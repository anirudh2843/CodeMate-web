import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  // Input fields state
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Toggle between Login and SignUp
  const [isLoginForm, setLoginForm] = useState(true);

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Login Handler
  const handleLogin = async () => {
    if (!emailId || !password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}`+"/login",
        { emailId, password },
        { withCredentials: true }
      );

      // On successful login
      if (res.status === 200 && res.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));

        // Set axios default header for auth
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

        // Update Redux store and navigate
        dispatch(addUser(res.data.data));
        navigate("/home");
      } else {
        setError("Login failed, try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed, please try again.");
    }
  };

  //  Signup Handler
  const handleSignUp = async () => {
    if (!firstName || !lastName || !emailId || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      // Update store and go to profile
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>

          <div>
            {/* Show First & Last Name for SignUp */}
            {!isLoginForm && (
              <>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input"
                    placeholder="Enter First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input"
                    placeholder="Enter Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </>
            )}

            {/* Common Email & Password fields */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email ID</legend>
              <input
                type="email"
                value={emailId}
                className="input"
                placeholder="Enter Email"
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

          {/* Show error message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Action Button */}
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>

          {/* Toggle Button */}
          <button onClick={() => setLoginForm(!isLoginForm)}>
            {isLoginForm
              ? "New User? Sign Up Here"
              : "Existing User? Login Here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
