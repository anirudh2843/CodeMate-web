import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Welcome from "./components/Welcome";
import Chat from "./components/Chat";
import Home from "./components/Home";
import DailyChallenges from "./components/DailyChallenges";
import { socket } from "./utils/socket";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { ToastContainer } from "react-toastify";
import NotificationListener from "./components/NotificationListener";
import "react-toastify/dist/ReactToastify.css";

// import axios from "axios";
// const token = localStorage.getItem("token");
// if (token) {
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

function App() {
  const user = useSelector((store) => store.user);

  // useEffect(() => {
  //   if (user?._id) {
  //     socket.emit("joinChat", {
  //       userId: user._id,
  //       firstName: user.firstName,
  //     });
  //   }
  // }, [user?._id]);

  return (
    <BrowserRouter basename="/">
      <NotificationListener />
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Welcome />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="feed" element={<Feed />} />
          <Route path="daily" element={<DailyChallenges />} />
          <Route path="profile" element={<Profile />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />
          <Route path="chat/:targetUserId" element={<Chat />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
