import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";
import Error from "./Error";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if necessary
          },
          withCredentials: true,
        }
      );
      dispatch(removeRequests(_id));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle Unauthorized error
        console.log("Unauthorized, please log in.");
        window.location.href = "/login";  // Redirect to login
      }
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle Unauthorized error
        console.log("Unauthorized, please log in.");
        window.location.href = "/login";  // Redirect to login
      } else {
        setError(true);
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (error) return <Error />;

  if (!requests || requests.length === 0) {
    return <h1 className="flex justify-center text-bold text-4xl font-bold my-10">No requests</h1>;
  }

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-2xl font-bold">Connection Requests</h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, age, gender, photoUrl, about } = request.fromUserId;
        return (
          <div key={_id} className="flex justify-center">
            <div className="flex justify-around m-4 p-4 rounded-2xl bg-base-300 w-1/2 mx-auto">
              <div>
                <img alt="photo" className="w-50 h-50 rounded-2xl" src={photoUrl} />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-bold text-xl">{firstName + " " + lastName}</h2>
                {age && <p>{age + ", " + gender}</p>}
                <p>{about}</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <button className="btn btn-primary my-5" onClick={() => reviewRequest("accepted", request._id)}>
                  Accept
                </button>
                <button className="btn btn-secondary my-5" onClick={() => reviewRequest("rejected", request._id)}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
