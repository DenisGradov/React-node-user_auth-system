import { useEffect, useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import { UserDataProps } from "./components/HomePage/types/HomePage.types";
import axios from "axios";
import Registration from "./components/Registration/Registration";
import Logout from "./components/Logout/Logout";

function App() {
  const [userData, setUserData] = useState<UserDataProps>({
    authorized: false,
  });
  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verifyToken`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (response)
          setUserData((prevData) => ({
            ...prevData,
            authorized: response.data.authorized,
          }));
      })
      .catch((error) => {
        console.error("Token validation failed", error);
      });
    //.finally(() => setCheckCookieOnBack(true));
  }, [userData.authorized]);

  useEffect(() => {
    console.log("User data updated:", userData);
  }, [userData]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage userData={userData} />} />
        <Route
          path="/registration"
          element={<Registration setUserData={setUserData} />}
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
