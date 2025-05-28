import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import Error from "./Error";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return <Error message="Failed to load feed. Please try again later." />;
  }

  if (!feed || feed.length === 0) {
    return (
      <h1 className="flex justify-center my-10 text-3xl font-bold">
        No New Users Found!
      </h1>
    );
  }

  const handleNext = () => {
    if (currentIndex < feed.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-6">
      <UserCard key={feed[currentIndex]._id} user={feed[currentIndex]} />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === feed.length - 1}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <p className="text-sm text-gray-400">
        {currentIndex + 1} of {feed.length}
      </p>
    </div>
  );
};

export default Feed;
