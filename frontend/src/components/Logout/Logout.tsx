//libs
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//types

const Logout: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Token validation failed", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>wait..</div>;
};

export default Logout;
