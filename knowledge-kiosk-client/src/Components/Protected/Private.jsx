import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../ContextProvider/AuthProvider';
import Swal from 'sweetalert2';


const PrivateRoute = ({ children }) => {
  const { loading, needsRegistration, isAuthenticated } = useContext(AuthContext);

  // Use React Router's location to remember where the user was trying to go
  const location = useLocation();

  // If AuthContext is still determining auth state, show a loading indicator/spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-100 h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  // If the user is NOT authenticated, redirect them to the login page
  if (!isAuthenticated()) {
    Swal.fire({
          title: "You are not logged in",
          text: " Please login to continue.",
          icon: "warning",
          showConfirmButton: false,
          timer: 1500,
        });
    
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If the user is logged in but flagged as needing registration, 
  // redirect them to the registration page
  if (needsRegistration) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default PrivateRoute;
