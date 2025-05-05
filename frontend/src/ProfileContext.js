import React, { createContext, useState, useContext } from 'react';
import siteLogoImg from './assets/images/logo.png';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const [profileName, setProfileName] = useState('');
  const [newMessage, setNewMessage] = useState(0);
  const [siteLogo, setSiteLogo] = useState(siteLogoImg);
  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage, theme, setTheme, profileName, setProfileName, newMessage, setNewMessage, siteLogo, setSiteLogo }}>
      {children}
    </ProfileContext.Provider>
  );
};