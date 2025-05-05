import React, { createContext, useContext, useState, useEffect } from 'react';
import socket from './socket';

const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({ children }) => {

  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    // Listen for updates to the online users list from the server
    socket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('online_users');
    };
  }, []);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

// Custom hook to use the OnlineUsersContext
export const useOnlineUsers = () => {
  return useContext(OnlineUsersContext);
};
