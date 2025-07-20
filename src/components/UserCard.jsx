import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, age, gender, skills, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show confirmation message (optional)
      if (res.data && res.data.message) {
        alert(res.data.message); // Or use a toast library like react-toastify
      }

      // Remove user from feed after successful request
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(
        "Error sending request:",
        err?.response?.data || err.message
      );
      alert("Failed to send request. Please try again.");
    }
  };

  return (
    <div className=" max-h-screen w-auto flex justify-center items-start">
      <div className="card bg-base-300 w-96 shadow-sm rounded-xl">
        <figure>
          <img
            src={user.photoUrl}
            alt="Photo"
            className="w-full object-cover rounded-t-xl"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          <p>{about}</p>
          {age && gender && <p>{age + ", " + gender}</p>}
          {skills && (
            <p>{Array.isArray(skills) ? skills.join(", ") : skills}</p>
          )}
          <div className="card-actions justify-center my-4">
            <button
              className="btn btn-primary"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
