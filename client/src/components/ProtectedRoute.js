import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const key = role === "doctor" ? "docToken" : "receptToken";
  const token = localStorage.getItem(key);

  if (!token) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
