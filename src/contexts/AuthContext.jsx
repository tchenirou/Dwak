import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // This holds the logged-in user's info

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // set user info from token
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);
  

  const login = (userData, token) => {
    try {
      if (typeof token !== "string") {
        throw new Error("Provided token is not a string");
      }

      const decoded = jwtDecode(token);
      setUser(decoded);
      localStorage.setItem("token", token);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
