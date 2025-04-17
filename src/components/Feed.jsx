import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import Error from "./Error";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true, // Include credentials in the request
      });

      // Dispatch feed data to Redux store
      dispatch(addFeed(res.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // If 401 error occurs, redirect to login page
        console.log("Unauthorized, please log in again");
        window.location.href = "/login";  // Or use react-router to redirect
      } else {
        console.error("Error fetching feed", err);
        return <Error />;
      }
    }
  };

  useEffect(() => {
    getFeed();
  }, []);  // Empty dependency array ensures this runs once

  if (!Array.isArray(feed)) {
    return <div>Loading...</div>;
  }

  if (feed.length === 0) {
    return <h1 className="flex justify-center my-4 text-3xl font-bold">No New Users Found!</h1>;
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
