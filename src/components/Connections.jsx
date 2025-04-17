import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import Error from "./Error";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  // Fetch connections with authentication token
  const fetchConnections = async () => {
    try {
      // Get the token from localStorage or Redux store (wherever you save it)
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError(true); // If no token, set error state
        return;
      }

      // Make the request with Authorization header
      const res = await axios.get(BASE_URL + "/user/connections", {
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token here
        },
        withCredentials: true, // Include credentials if needed
      });

      const validConnections = res?.data?.data?.filter((con) => con !== null);
      dispatch(addConnections(validConnections));
    } catch (err) {
      setError(true); // If an error occurs (e.g., unauthorized), set error state
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (error) return <Error />;

  if (!connections || connections.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-5xl">No connections</h1>
    );

  return (
    <div className="text-center my-10 flex flex-col ">
      <h1 className="text-bold text-2xl font-bold">Connections</h1>

      {connections.map((con) => {
        const { _id, firstName, lastName, age, gender, photoUrl, about } = con;
        return (
          <div key={_id} className="flex justify-center">
            <div className=" flex justify-around m-4 p-4 rounded-2xl bg-base-300 w-1/2 mx-auto">
              <div>
                <img
                  alt="photo"
                  className="w-50 h-50 rounded-2xl "
                  src={photoUrl}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-bold  text-xl">
                  {firstName + " " + lastName}
                </h2>
                {age && <p>{age + ", " + gender}</p>}
                <p>{about}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
