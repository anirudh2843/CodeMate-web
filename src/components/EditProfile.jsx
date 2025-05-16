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
        { firstName, lastName, about, age, photoUrl, gender, skills },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setToast(true);
      setTimeout(() => setToast(false), 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-5xl w-full flex flex-col md:flex-row gap-10">
          {/* Form Card */}
          <div className="w-full max-w-2xl mx-auto p-6 rounded-xl shadow-xl border-5 border-blue-300  transition-all duration-300">
            <h2 className="text-3xl font-semibold text-center mb-8 text-white">
              Edit Profile
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
              className="space-y-6"
            >
              {[
                {
                  label: "First Name",
                  value: firstName,
                  setValue: setFirstName,
                  type: "text",
                },
                {
                  label: "Last Name",
                  value: lastName,
                  setValue: setLastName,
                  type: "text",
                },
                {
                  label: "Age",
                  value: age,
                  setValue: (v) => setAge(v.replace(/\D/, "")),
                  type: "number",
                },
                {
                  label: "Gender",
                  value: gender,
                  setValue: setGender,
                  type: "text",
                },
                {
                  label: "About",
                  value: about,
                  setValue: setAbout,
                  type: "text",
                },
                {
                  label: "Photo URL",
                  value: photoUrl,
                  setValue: setPhotoUrl,
                  type: "text",
                },
                {
                  label: "Skills",
                  value: skills,
                  setValue: setSkills,
                  type: "text",
                },
              ].map(({ label, value, setValue, type }) => (
                <div key={label} className="relative">
                  <input
                    id={label}
                    type={type}
                    value={value}
                    placeholder=" "
                    onChange={(e) => setValue(e.target.value)}
                    className="peer w-full bg-transparent border border-gray-900 text-white placeholder-transparent px-4 pt-6 pb-2 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                  <label
                    htmlFor={label}
                    className="absolute left-4 top-2 text-gray-800 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400"
                  >
                    {label}
                  </label>
                </div>
              ))}

              {error && (
                <p className="text-red-500 text-center font-medium">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow hover:shadow-lg"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* UserCard Preview */}
          <div className="flex-1 flex justify-center items-start">
            <div className="rounded-xl p-6 max-w-sm">
              <UserCard
                user={{
                  firstName,
                  lastName,
                  about,
                  age,
                  photoUrl,
                  gender,
                  skills,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg font-semibold animate-fadeInOut z-50">
          Profile Updated Successfully!
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0%, 100% {opacity: 0; transform: translateY(-10px);}
          10%, 90% {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeInOut {
          animation: fadeInOut 2s ease forwards;
        }
      `}</style>
    </>
  );
};

export default EditProfile;
