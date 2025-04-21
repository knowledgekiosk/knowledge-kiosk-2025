import { useContext } from "react";
import { AuthContext } from "../../ContextProvider/AuthProvider";
import { useLocation } from "react-router-dom";

export const AdminProtection = ({children}) => {
  const { cardData, loading, logout, needsRegistration } = useContext(AuthContext);
  const isAdmin = cardData?.role === "admin";

  const location = useLocation();

 
  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-100 h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  // If the user is NOT authenticated, redirect them to the login page
  if (!isAdmin) {
    logout()
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (needsRegistration) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return children;
};
