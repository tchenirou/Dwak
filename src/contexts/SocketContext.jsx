// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const socketInstance = io("http://localhost:5000", {
      auth: { token }
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);