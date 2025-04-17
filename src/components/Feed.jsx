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
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      <Error />;
    }
  };
  useEffect(() => {
    getFeed();
  }, []);

  if(!feed){
    return ;
  }
  if(feed.length<=0){
    return <h1 className="flex justify-center my-4 text-3xl font-bold">No New Users Found!</h1>
  }

  return (
    feed && (
      <div className="flex justify-center my-10 ">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
