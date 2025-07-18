import React from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user); // 👤 Get logged-in user from Redux

  // ✅ Only show EditProfile if user exists
  return (
    user && (
      <div className="p-4">
        <EditProfile user={user} />
      </div>
    )
  );
};

export default Profile;
