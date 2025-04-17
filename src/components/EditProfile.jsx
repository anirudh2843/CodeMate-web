import React, { useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const [skills, setSkills] = useState(user.skills || "");
  const dispatch = useDispatch();
  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, about, age, photoUrl, gender, skills},
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setPhotoUrl(photoUrl);
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong!");
    }
  };
  return (
    <>
      <div className="flex justify-around ">
        <div className="flex justify-center">
          <div className="card card-border bg-base-300 w-96">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">FirstName :</legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input"
                    placeholder="FirstName"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">LastName :</legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input"
                    placeholder="LastName"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Age :</legend>
                  <input
                    type="number"
                    value={age}
                    className="input"
                    placeholder="Age"
                    onChange={(e) => setAge(e.target.value.replace(/\D/, ""))}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Gender :</legend>
                  <input
                    type="text"
                    value={gender}
                    className="input"
                    placeholder="Gender"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">About :</legend>
                  <input
                    type="text"
                    value={about}
                    className="input"
                    placeholder="About"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">PhotoUrl :</legend>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input"
                    placeholder="PhotoUrl"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Skills :</legend>
                  <input
                    type="text"
                    value={skills}
                    className="input"
                    placeholder="skills"
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </fieldset>
              </div>
              {error && <p className="text-red-500">{error}</p> }
              
              <div className="card-actions justify-center">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, about, age, photoUrl, gender, skills }}
        />
      </div>
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-md shadow-lg">
          Profile Updated Successfully...
        </div>
      )}
    </>
  );
};

export default EditProfile;
