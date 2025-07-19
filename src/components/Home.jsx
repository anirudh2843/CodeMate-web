import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-white ">
      <h1 className="text-4xl font-bold mb-6 text-green-400 text-center">
        Welcome to Codemate
      </h1>

      <p className="text-lg mb-10 max-w-2xl text-center text-gray-300">
        Codemate is your space to connect with fellow developers, share ideas,
        grow together, and build meaningful tech collaborations.
      </p>
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-xl">
        <button
          onClick={() => navigate("/feed")}
          className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white text-center"
        >
          Go to Feed
        </button>
        <button
          onClick={() => navigate("/daily")}
          className="flex-1 min-w-[150px] bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold text-white text-center"
        >
          Code
        </button>
      </div>
    </div>
  );
};

export default Home;
