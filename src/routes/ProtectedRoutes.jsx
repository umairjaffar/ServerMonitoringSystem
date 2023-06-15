import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("UserRole");
  const token = localStorage.getItem("access_token");
  const role = allowedRoles.find((item) => item === userRole);
  if (token && role) {
    return children;
  } else if (!children) {
    return navigate("/dashboard/*");
  } else {
    return navigate("/login");
  }
};

export default ProtectedRoute;
