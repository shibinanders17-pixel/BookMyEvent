// pages/NotFound.jsx
import {useNavigate} from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-6xl mb-4">😕</p>
      <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
     
      <button onClick={() => navigate("/")}
        className="px-6 py-2 bg-purple-600 text-white rounded-full font-bold">
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;