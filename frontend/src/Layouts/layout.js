import React, { useState, useEffect } from "react";
import Header from "./header";
// import Footer from "./footer";


import { Modal } from 'react-bootstrap';

import u_user from './../assets/images/u_user.svg';
import u_credit_card from './../assets/images/u_credit-card.svg';
import u_eye from './../assets/images/u_eye.svg';
import fi_bell_dark from './../assets/images/fi_bell_dark.svg';
import u_shield from './../assets/images/u_shield.svg';
import fi_help_circle from './../assets/images/fi_help-circle.svg';
import PasswordImg from './../assets/images/password.png';
import goal from './../assets/images/goal.png';


/* routes */
import MyData from './../pages/Setting/myData';
import Password from './../pages/Setting/Password';
import Payments from './../pages/Setting/Payments';
import Visibility from './../pages/Setting/Visibility';
import Notifications from './../pages/Setting/Notifications';
import DataPrivacy from './../pages/Setting/DataPrivacy';
import HelpCenter from './../pages/Setting/HelpCenter';
import Goal from './../pages/Setting/Goal';


import userDataHook from "../userDataHook";
import { useNavigate } from 'react-router-dom';

import { useProfile } from '../ProfileContext';

import socket from '../socket';

import BackToTopButton from './BackToTopButton';

const Layout=(props)=>{

    const url = new URL(window.location.href);
    const req_type = url.searchParams.get('req_type');
    console.log(req_type);
    const userData = userDataHook();
    const { profileImage, theme, setTheme, profileName   } = useProfile();
    const [showModal, setShowModal] = useState(false);
    const [activeSetting, setActiveSetting] = useState('MyData');
    const navigate = useNavigate();

    var interval = "";

      // Function to get initial theme based on user preference or default
    function getInitialTheme() {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        var bg =  "dark";
      }else{
        var bg =  "light";
      }
      localStorage.setItem("theme", bg);
      setTheme(bg);
      return bg;
    }

    // Function to change theme
    const changeTheme = (newTheme) => {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
      if(!localStorage.getItem("theme")){
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          var bg =  "dark";
        }else{
          var bg =  "light";
        }
        localStorage.setItem("theme", bg);
        setTheme(bg);
      }
    },[]);

    const openSettingModal = () => {
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    // Handler to change the active setting component
    const handleSetActiveSetting = (setting) => {
      setActiveSetting(setting);
    };

    const logout = () => {

      const userId = userData._id; // Replace this with your user ID logic
      const RND = localStorage.getItem('RND');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('isLoggedUser');
      localStorage.removeItem('Roles');

      clearInterval(interval);
      // Emit logout event to server
      socket.emit('user_logout', `${userId}:${RND}`);

      navigate('/login');
    };


    return(
        <>
          <div className={`App ${theme}`}>

            {!req_type && <Header changeTheme={changeTheme} interval={interval} getInitialTheme={getInitialTheme} openSettingModal={openSettingModal} logout={logout} />}
              {props.children}

            {!req_type && <Modal className={`setting_modal ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
              <Modal.Header closeButton> </Modal.Header>
              <Modal.Body>
                  <div className="setting_content_block">
                      <div className="setting_nav">
                          <div className="setting_user">
                            <div className="suser_img"> <img src={profileImage} alt="user" /> </div>
                            <p className="m-0 suser_name"> {profileName} </p>
                          </div>
                          <ul className="">
                              <li onClick={() => handleSetActiveSetting('MyData')} key="MyData">
                                <a className={activeSetting === 'MyData' ? "active" : ""}> <img src={u_user}  alt=""/><span> My Data </span> </a>
                              </li>

                              {(userData?.signup_type!=="google" && userData?.signup_type!=="linkedin") && <li onClick={() => handleSetActiveSetting('Password')} key="Password">
                                <a className={activeSetting === 'Password' ? "active" : ""}> <img src={PasswordImg}  alt=""/><span> Password </span> </a>
                              </li>}

                              {userData.user_type === "parents" &&
                                <li onClick={() => handleSetActiveSetting('Payments')} key="Payments">
                                  <a className={activeSetting === 'Payments' ? "active" : ""}> <img src={u_credit_card}  alt=""/> <span>Payments</span> </a>
                                </li>
                              }
                              {userData.user_type === "teenager" && <li onClick={() => handleSetActiveSetting('Visibility')} key="Visibility">
                                <a className={activeSetting === 'Visibility' ? "active" : ""}><img src={u_eye}  alt=""/> <span>Visibility</span> </a>
                              </li>}
                              {/* {(userData.user_type === "parents" || userData.user_type === "teenager") &&
                                <li onClick={() => handleSetActiveSetting('Notifications')} key="Notifications">
                                  <a className={activeSetting === 'Notifications' ? "active" : ""}><img src={fi_bell_dark}  alt=""/> <span>Notifications</span></a>
                                </li>
                              } */}
                              <li onClick={() => handleSetActiveSetting('DataPrivacy')} key="DataPrivacy">
                              <a className={activeSetting === 'DataPrivacy' ? "active" : ""}><img src={u_shield}  alt=""/> <span>Data Privacy</span>  </a>
                              </li>
                              <li onClick={() => handleSetActiveSetting('HelpCenter')} key="HelpCenter">
                              <a className={activeSetting === 'HelpCenter' ? "active" : ""}><img src={fi_help_circle}  alt=""/> <span>Help Center</span> </a>
                              </li>
                              {userData.user_type === "parents" && <li onClick={() => handleSetActiveSetting('Goal')} key="Goal">
                                <a className={activeSetting === 'Goal' ? "active" : ""}><img src={goal}  alt=""/> <span>Goal</span> </a>
                              </li>}
                          </ul>
                      </div>

                      <div className="setting_pages">
                          {activeSetting === 'MyData' && <MyData handleCloseModal={handleCloseModal}/>}
                          {(userData.signup_type!=='google' &&  userData.signup_type!=='linkedin') &&  activeSetting === 'Password' && <Password handleCloseModal={handleCloseModal}/>}
                          {activeSetting === 'Payments'  && userData.user_type === "parents" && <Payments />}
                          {activeSetting === 'Visibility' && userData.user_type === "teenager" && <Visibility />}
                          {activeSetting === 'Notifications' && (userData.user_type === "parents" || userData.user_type === "teenager") && <Notifications />}
                          {activeSetting === 'DataPrivacy' && <DataPrivacy />}
                          {activeSetting === 'HelpCenter' && <HelpCenter />}
                          {activeSetting === 'Goal' && userData.user_type === "parents" && <Goal />}
                      </div>

                  </div>
              </Modal.Body>
            </Modal>}

            <BackToTopButton />
          </div>
        </>
    )

};

export default Layout;