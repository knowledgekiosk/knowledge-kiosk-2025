import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../ContextProvider/AuthProvider'; // Import your AuthContext

const PrivateRoute = ({ children }) => {
  // Access the user and loading state from AuthContext
  const { user, loading, needsRegistration } = useContext(AuthContext); 
  const location = useLocation();

  if (loading) {
    // Add your loading skeleton or spinner here
    return (
      <div className="flex flex-col gap-4 w-52">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate state={{ from: location }} to="/login" replace />;
  }

  // If user is logged in but needs registration, redirect to the registration page
  if (needsRegistration) {
    return <Navigate state={{ from: location }} to="/register" replace />;
  }

  // If user is logged in and doesn't need registration, render the children (protected route content)
  return children;
};

export default PrivateRoute;
