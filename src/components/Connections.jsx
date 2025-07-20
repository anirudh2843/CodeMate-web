import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { socket } from "../utils/socket";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!currentUser?._id) return;

    // ✅ Emit joinChat with userId only (targetUserId not needed here)
    socket.emit("joinChat", {
      userId: currentUser._id,
      firstName: currentUser.firstName || "User",
    });

    // ✅ Listen for updated list of online users
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users); // Set in state
    });

    // ✅ Clean up socket listener on unmount
    return () => {
      socket.off("onlineUsers");
    };
  }, [currentUser?._id]);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const validConnections = res?.data?.data?.filter((con) => con !== null);
      dispatch(addConnections(validConnections));
    } catch (err) {
      console.error(
        "Error fetching connections:",
        err?.response?.data || err.message
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading)
    return (
      <h1 className="text-center my-10 text-gray-500">
        Loading connections...
      </h1>
    );

  if (error)
    return (
      <h1 className="text-center my-10 text-red-500 text-xl font-bold">
        Failed to load connections. Please try again.
      </h1>
    );

  if (!connections || connections.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-4xl text-gray-600 font-semibold">
        No connections
      </h1>
    );

  const uniqueConnections = Array.from(
    new Map(connections.map((con) => [con._id, con])).values()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-amber-500">
        Connections
      </h1>

      <div className="space-y-6">
        {uniqueConnections.map((con) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about } =
            con;
          return (
            <div
              key={_id}
              className="flex flex-col sm:flex-row items-center bg-black text-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow duration-300 w-full max-w-full"
            >
              <img
                alt={`${firstName} ${lastName}`}
                src={photoUrl}
                className="w-28 h-28 sm:w-45 sm:h-45 rounded-4xl object-cover border-2 border-indigo-500 flex-shrink-0"
              />
              <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 min-w-0 text-center sm:text-left">
                <h2 className="text-xl font-semibold">
                  {firstName} {lastName}
                  {onlineUsers.includes(_id) && (
                    <span className="inline-block ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </h2>
                {age && gender && (
                  <p className="text-sm mt-1">
                    {age} years, {gender}
                  </p>
                )}
                <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-xl">
                  {about}
                </p>
              </div>
              <Link to={`/chat/${_id}`}>
                <button className="mt-4 sm:mt-0 sm:ml-6 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Chat
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
