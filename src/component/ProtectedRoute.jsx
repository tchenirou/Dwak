import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/authUtils"; // Import the utility function

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = getUserRole(); // Get the current user's role from the token

  // Check if the user's role is allowed to access the route
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />; // Redirect to login if not allowed
  }

  return element; // Render the protected element if the role matches
};

export default ProtectedRoute;
