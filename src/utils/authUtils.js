// src/utils/authUtils.js

import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decodedToken = jwtDecode(token); // Direct usage of jwt_decode function
  return decodedToken?.role; // Assuming the role is part of the token
};
