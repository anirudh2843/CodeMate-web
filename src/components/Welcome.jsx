import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Welcome = () => {
  const navigate = useNavigate();

  // Accessing user data from Redux store
  const userData = useSelector((store) => store.user);

  // Checking if user is logged in (based on user object)
  const isLoggedIn = userData && Object.keys(userData).length > 0;

  // Redirect to /feed if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/feed");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-5xl">
      {/* Welcome headline */}
      <h1>
        Welcome to the{" "}
        <span className="font-bold italic text-yellow-500">Coder's World!!!</span>
      </h1>

      {/* Subheadline */}
      <h2 className="text-xl font-bold text-yellow-500 mt-4 italic">
        Connect with{" "}
        <span className="font-bold text-4xl text-gray-200">like-minded people</span>
      </h2>

      {/* Button to navigate to login page */}
      <button
        className="border border-blue-500 bg-black text-white text-2xl italic px-5 py-2 rounded-2xl mt-4"
        onClick={() => navigate("/login")}
      >
        Let's Start
      </button>
    </div>
  );
};

export default Welcome;
