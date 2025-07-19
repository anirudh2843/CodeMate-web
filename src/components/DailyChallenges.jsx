import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialProblems = [
  {
    id: 1,
    title: "Second Largest",
    link: "https://www.geeksforgeeks.org/batch/gfg-160-problems/track/arrays-gfg-160/problem/second-largest3735",
  },
  {
    id: 2,
    title: "FizzBuzz",
    link: "https://leetcode.com/problems/fizz-buzz/",
  },
  {
    id: 3,
    title: "Move Zeros to End",
    link: "https://www.geeksforgeeks.org/batch/gfg-160-problems/track/arrays-gfg-160/problem/move-all-zeroes-to-end-of-array0751",
  },
  {
    id: 4,
    title: "Reverse An Array",
    link: "https://www.geeksforgeeks.org/batch/gfg-160-problems/track/arrays-gfg-160/problem/reverse-an-array",
  },
  {
    id: 5,
    title: "Find Max",
    link: "https://leetcode.com/problems/maximum-subarray/",
  },
];

const DailyChallenges = () => {
  const navigate = useNavigate();

  const [completed, setCompleted] = useState([]);

  const handleComplete = (id) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
  };

  return (
    <div className="text-white p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/home")}
        className="mb-4 bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded"
      >
        ← Go Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Daily Challenges</h1>
      <ul className="space-y-3">
        {initialProblems.map((problem) => (
          <li
            key={problem.id}
            className={`p-4 rounded-lg shadow ${
              completed.includes(problem.id) ? "bg-green-700" : "bg-gray-800"
            }`}
          >
            <h2 className="text-lg font-semibold">{problem.title}</h2>
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline block mt-1"
            >
              View Problem
            </a>
            {!completed.includes(problem.id) && (
              <button
                onClick={() => handleComplete(problem.id)}
                className="mt-2 bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded"
              >
                Mark as Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyChallenges;
