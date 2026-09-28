import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        {isAuthenticated ? (
          <Link 
            to="/dashboard" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition inline-block w-full"
          >
            Back to Dashboard
          </Link>
        ) : (
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition inline-block w-full"
          >
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default NotFound;
