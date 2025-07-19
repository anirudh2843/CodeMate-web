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

// import axios from "axios";
// const token = localStorage.getItem("token");
// if (token) {
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
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
      </BrowserRouter>
    </Provider>
  );
}

export default App;
