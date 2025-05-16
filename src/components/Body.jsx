import React, { useEffect } from "react";
import NavBar from "./NavBar.jsx";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer.jsx";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import backgroundImage from "../assests/bg.jpg";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    // Check if user is already loaded
    if (userData && Object.keys(userData).length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        if (
          location.pathname !== "/welcome" &&
          location.pathname !== "/login"
        ) {
          navigate("/welcome");
        }
      } else {
        console.error("Error fetching user:", err);
      }
    }
  };

  useEffect(() => {
    const publicRoutes = ["/", "/welcome", "/login"];
    if (!publicRoutes.includes(location.pathname)) {
      fetchUser();
    }
  }, [location.pathname]);

  return (
    <div
      className="relative bg-cover bg-center bg-fixed min-h-screen w-full flex flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen overflow-y-auto">
        <NavBar />

        <main className="flex-grow px-4 sm:px-6 md:px-10 lg:px-20 py-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Body;
