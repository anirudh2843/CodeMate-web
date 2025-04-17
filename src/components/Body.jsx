import React, { useEffect } from "react";
import NavBar from "./NavBar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer.jsx";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import backgroundImage from "../assests/bg.jpg";
const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/welcome");
      }
    }
  };

  useEffect(() => {
    const publicRoutes = ["/welcome", "/login"];
    if (!publicRoutes.includes(location.pathname)) {
      fetchUser();
    }
  }, [location.pathname]);

  return (
    <div
      className="relative bg-cover bg-center min-h-screen w-full flex flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Body;
