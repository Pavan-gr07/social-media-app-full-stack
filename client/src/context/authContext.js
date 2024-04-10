import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  const login = async (data) => {
    //TO DO

    const response = await axios.post(
      "http://localhost:8000/api/auth/login",
      data
    );
    localStorage.setItem("idToken", response?.data?.token);

    setCurrentUser({
      id: response?.data?.others?.id,
      name: response?.data?.others?.username,
      profilePic:
        "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600",
    });
    return response?.data;
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
