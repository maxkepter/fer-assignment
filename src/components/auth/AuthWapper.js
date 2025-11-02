import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const AuthWrapper = ({ role }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in → block access
    if (!user) {
      navigate("/login");
      return;
    }

    // If role is specified and doesn't match → block access
    if (role && role.includes(user.role) === false) {
      navigate("/");
      return;
    }
  }, [user, role, navigate]);

  // If checks pass, render the child routes
  return <Outlet />;
};

export default AuthWrapper;
