import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
}) => {
  const location = useLocation();
  //   const isAuthenticated = true;
  const role = "user";

  // first check if user is authenticated by getting user authentication state from the redux get the role of user that is going to check below.

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
    // this location state can be used from the login page to redirect the user where he was requesting to land after the login.
  }else {
    return <Component />;
  }
};

export default ProtectedRoute;
