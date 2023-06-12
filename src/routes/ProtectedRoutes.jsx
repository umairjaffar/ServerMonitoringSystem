import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  // const param = useParams();
  const userRole = localStorage.getItem("UserRole");
  const token = localStorage.getItem("access_token");
  const role = allowedRoles.find((item) => item === userRole);
  console.log("AllowRoles", allowedRoles);
  console.log("Child", children);
  console.log("Role", userRole);
  console.log("role", role);
  // -----------------------------------------
  // console.log("Param", param);

  // console.log("Children", children?.props?.children);
  // const path = children?.props?.children?.map((item) => item.props.path);
  // console.log("path", path);

  if (token && role && children) {
    console.log("OK");
    return children;
  } else {
    console.log("NO");
    return navigate("/login");
  }
};

export default ProtectedRoute;
