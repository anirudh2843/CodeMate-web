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
        withCredentials: true,
      });
      dispatch(addFeed(res.data || [])); // Ensure data is not null
    } catch (err) {
      // Handle error properly (returning Error component or logging)
      console.error(err);
      return <Error />;
    }
  };

  useEffect(() => {
    getFeed();
  }, []); // Empty dependency array ensures this runs once

  // Ensure feed is an array before checking its length
  if (!Array.isArray(feed)) {
    return <div>Loading...</div>; // Display loading if feed is not an array
  }

  if (feed.length === 0) {
    return (
      <h1 className="flex justify-center my-4 text-3xl font-bold">
        No New Users Found!
      </h1>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
