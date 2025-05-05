import React, {useState, useRef, useEffect} from "react";
import { Link, NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import './layout.css'
import siteLogoImg from '../assets/images/logo.png';
import fi_bell from '../assets/images/fi_bell.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import u_check from '../assets/images/u_check.svg';

import u_brightness from '../assets/images/appearance.png';
import u_setting from '../assets/images/u_setting.svg';
import fi_logout from '../assets/images/fi_logout.svg';

import u_brightness_low from '../assets/images/u_brightness_low.svg';
import u_moon from '../assets/images/u_moon.svg';
import u_desktop from '../assets/images/u_desktop.svg';
import dashboard from '../assets/images/dashboard.png';
import email from '../assets/images/email.png';
import briefcase from '../assets/images/briefcase.png';
import resource from '../assets/images/resource.png';
import wallet from '../assets/images/wallet.png';
import LMS from '../assets/images/lms.png';
import learning from '../assets/images/learning.png';
import subusers from '../assets/images/subusers.png';

import Leaderboard from '../assets/images/leaderboard.png';
import Rewards from '../assets/images/rewards.png';
import RewardOrders from '../assets/images/rewardsorder.png';
import ProgressDashboard from '../assets/images/progressDashborad.png';

import { jwtDecode } from 'jwt-decode';

import user_ico from '../assets/images/u_user.svg';
import consultation from '../assets/images/consultation.png';
import Notification from './Notification';

import userDataHook from "../userDataHook";
import { useProfile } from '../ProfileContext';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Goal from '../assets/images/goalt.png';
import Cashicon from '../assets/images/3d-cash-money.png';

//import CountdownTimer from './CountdownTimer';

//import { useProfileImage } from '../ProfileImageContext';

const getRemainingTokenTime = (token) => {
    if (!token) return 0; // No token, so return 0 minutes remaining

    const { exp } = jwtDecode(token);
    if (!exp) return 0; // No expiration date, return 0 minutes remaining

    const currentTime = Date.now() / 1000;
    const remainingTimeInSeconds = exp - currentTime;

    // Convert the remaining time to minutes
    const remainingTimeInMinutes = Math.floor(remainingTimeInSeconds / 60);

    return remainingTimeInMinutes > 0 ? remainingTimeInMinutes : 0; // Return 0 if the token is expired
};

const Header=({changeTheme, getInitialTheme, openSettingModal, logout, interval })=>{

    const userData = userDataHook();
    const { profileImage, setProfileImage, theme, profileName, setProfileName, newMessage, setNewMessage, siteLogo, setSiteLogo } = useProfile();
    const TOKEN = localStorage.getItem('token');

    const [isOpen, setIsOpen] = useState(false);
    const [notification, setNotification] = useState([]);
    const [unread, setUnread] = useState(false);
    const SiteConfig = JSON.parse(localStorage.getItem('ConfigData'));
    const [sessionOut, setSessionOut] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const sessionOutRef = useRef(sessionOut);
    const [goals, setGoals] = useState([]);
    const [propath, setProPath] = useState('');

    const ref = useRef(null);

    const OpenPopup = () => {
        setIsOpen(!isOpen);
        markReadNotifications();
    };

    const closePopup = () => {
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if(userData){
            setProfileImage(userData.profile_image);
            setProfileName(userData.preferred_name?userData.preferred_name:`${userData.first_name} ${userData.last_name}`);
        }

        setSiteLogo(SiteConfig?.app_logo||siteLogoImg);

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userData]);

    useEffect(() => {
        sessionOutRef.current = sessionOut;
    }, [sessionOut]);

    useEffect(() => {
        if(sessionOutRef.current){
            if (seconds > 0) {
                const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
                return () => clearTimeout(timerId);
            } else {
                logout();
            }
        }
    }, [seconds]);

    useEffect(() => {
        unreadCounts();
        getNotification();
        const intervalId = setInterval(() => {
            unreadCounts();
            getNotification();
            checkSession();
        }, 6000);
        return () => clearInterval(intervalId);
    }, []);

    const checkSession = () => {
        const CURRENT_TOKEN = localStorage.getItem('token');
        const remainingTime = getRemainingTokenTime(CURRENT_TOKEN);

        if (!sessionOutRef.current && remainingTime <= 2) {
            setSessionOut(true);
            setSeconds(60);
        }
    };

    const unreadCounts = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/chat/unread-count?user=${userData._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setNewMessage(result.counts);
            }else{
                clearInterval(interval);
            }
        })
        .catch((error) => {
            console.error(error);
            clearInterval(interval);
        });
    }

    const getNotification = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-notificaion`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setNotification(result.data);
                setUnread(result.unread);
            }else{
                clearInterval(interval);
            }
        })
        .catch((error) => {
            console.error(error);
            clearInterval(interval);
        });
    }

    const markReadNotifications = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/read-notificaion`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
            if(result.status){
                setTimeout(() => {
                    getNotification()
                }, 6000);
            }
        })
        .catch((error) => console.error(error));
    }

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggle = (isOpen) => {
        setShowDropdown(isOpen);
    };

    const handleLinkClick = () => {
        setShowDropdown(false);
    };

    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
      setDropdownVisible((prevState) => !prevState);
    };

    const closeDropdown = () => {
      setDropdownVisible(false);
    };

    const getGoals = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-golas`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setGoals(result.data);
                setProPath(result.path);
            }
        })
        .catch((error) => console.error(error.message));
    }

    const GoalCard = ({values}) => {
        return (
            <div className="goal_dropdown">
                <div className="d-flex align-items-center justify-content-between gtop">
                    <h4 className="goal_title">Target Goal</h4>
                    <button className="btnclose" type="button" onClick={closeDropdown}>X</button>
                </div>

                {values.map((goal) => {
                    const isProductReward = goal.reward_type === 'product';
                    const isCreditReward = goal.reward_type === 'credit';
                    const isPathReward = goal.reward_for === 'path';
                    const isSkillReward = goal.reward_for === 'skill';
                    const rewardImage = isProductReward ? propath + goal.reward_product?.image : Cashicon;
                    const rewardTitle = isProductReward
                        ? goal.reward_product?.title
                        : `Reward: C ${goal.reward_credit}`;
                    const completedOn = isPathReward
                        ? goal.reward_path?.title
                        : goal.reward_skill?.title;

                    // Only render if required data is present
                    if (
                        (isProductReward && goal.reward_product?._id && ((isPathReward && goal.reward_path?._id) || (isSkillReward && goal.reward_skill?._id))) ||
                        (isCreditReward && ((isPathReward && goal.reward_path?._id) || (isSkillReward && goal.reward_skill?._id)))
                    ) {
                        return (
                            <div className="goal_list" key={goal._id}>
                                <div className="gl_block">
                                    <img src={rewardImage} alt={rewardTitle} />
                                    <div className="flex">

                                        {isProductReward?<Link onClick={closeDropdown} to={`/product-detail/${window.createSlug(rewardTitle)}/${goal.reward_product._id}`} style={{textDecoration:'none',color:'#1D1D1F'}}>
                                            <h6>{rewardTitle}</h6>
                                        </Link>:<h6>{rewardTitle}</h6>}

                                        <p style={{ fontSize: '12px' }}> <Link to="/my-learning" onClick={closeDropdown} style={{textDecoration:'none',color: '#1D1D1F'}}>On completing the <b>“{completedOn}”</b> {isPathReward?'learning path':'skill'} </Link></p>

                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return null; // Don't render anything if conditions are not met
                })}
            </div>
        )
    }

    return(
        <>
        <header>
            <Container fluid>
                <div className="headerRow">
                    <div className="siteLogo"> <Link to="/"> <img className='logo' src={siteLogo} alt='logo'/> </Link> </div>

                    <ul className={`header_nav d-flex justify-content-center ${userData.user_type === 'teenager' ? 'teenager_nav' : ''}`}>
                        <li>
                            <NavLink className="navbar__link" to="/dashboard">
                                <img src={dashboard} alt="" className="d-md-none d-inline-block"/>
                                <span> Dashboard </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="navbar__link bell_icon" to="/chat">
                                <img src={email} alt="" className="d-md-none d-inline-block"/>
                                <span> Messages </span>
                                {newMessage > 0 && <span className="notifi">{newMessage > 99?'+'+newMessage:newMessage}</span>}
                            </NavLink>
                        </li>
                        {(userData.user_type==='manager' || userData.user_type==='teenager') && <li>
                            <NavLink className="navbar__link" to="/jobs">
                                <img src={briefcase} alt="" className="d-md-none d-inline-block"/>
                                <span> Jobs </span>
                            </NavLink>
                        </li>}

                        {/* {(userData.user_type==='parents' || userData.user_type==='teenager') && <li>
                            <NavLink className="navbar__link" to="/wallet">
                                <img src={wallet} alt="" className="d-md-none d-inline-block"/>
                                <span> Wallet </span>
                            </NavLink>
                        </li>} */}
                        {/* userData.user_type==='parents' ||  */}
                        {(userData.user_type==='teenager') && <li>
                            <NavLink className="navbar__link d-xl-block d-none" to="/learning-path">
                                <img src={LMS} alt="" className="d-md-none d-inline-block"/>
                                <span> Learn </span>
                            </NavLink>
                        </li>}

                        {(userData.user_type==='teenager') && <li>
                            <NavLink className="navbar__link d-xl-block d-none" to="/my-learning">
                                <span> My Learning </span>
                            </NavLink>
                        </li>}

                        {/* {(userData.user_type==='manager' || userData.user_type==='subuser' || userData.user_type==='teenager') && <li>
                            <NavLink className="navbar__link d-xl-block d-none" to="/resources">
                                <span> Resources </span>
                            </NavLink>
                        </li>} */}


                        {(userData.user_type==='parents' || userData.user_type==='teenager') &&
                            <>
                                <li>
                                    <NavLink className="navbar__link d-xl-block d-none" to="/leaderboard">
                                        {/* <img src={Leaderboard} alt="" className="d-md-none d-inline-block"/> */}
                                        <span> Leaderboard </span>
                                    </NavLink>
                                </li>

                               {/*  <li>
                                    <NavLink className="navbar__link d-xl-block d-none" to="/products">
                                        <span> Rewards </span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink className="navbar__link d-xl-block d-none" to="/product-orders">
                                        <span> Reward Orders </span>
                                    </NavLink>
                                </li> */}
                            </>
                        }

                        {/* { userData.user_type==='parents' &&
                            <li>
                                <NavLink className="navbar__link " to="/progress-dashboard">
                                    <img src={ProgressDashboard} alt="" className="d-md-none d-inline-block"/>
                                    <span> Progress Dashboard </span>
                                </NavLink>
                            </li>
                        } */}

                        {
                            (userData.user_type==='manager' && (userData.employer_type==='Franchise' || userData.employer_type==="Multi-Location Operator")) &&
                            <li>
                                <NavLink className="navbar__link d-xl-block d-none" to="/manage-sub-user">
                                    <span> Sub Users </span>
                                </NavLink>
                            </li>
                        }
                        {
                            (userData.user_type==='manager') &&
                            <li>
                                <NavLink className="navbar__link d-xl-block d-none" to="/subscription">
                                    <span> Subscription </span>
                                    {userData.subscription_status && <sup className="pp_title">{userData.plan_id.plan_name}</sup>}
                                </NavLink>
                            </li>
                        }
                    </ul>

                    <ul className="header_nav_right d-flex justify-content-center">
                        { userData.user_type==='teenager' && <li className="d-xl-block d-none">
                            <NavLink className="navbar__link guident_link" to="/guidance-counselor">
                            Guidance Counselor
                            </NavLink>
                        </li>}

                        {userData.user_type==='teenager' && <li className="goal_li">
                            <NavLink className="navbar__link goal_link" to="" onClick={(e) => {
                                    e.preventDefault(); // Prevent default navigation
                                    getGoals();
                                    toggleDropdown();
                                }}>
                                <span> Goal </span>
                            </NavLink>
                            {isDropdownVisible && ( <GoalCard values={goals} />)}
                        </li>}


                        <li ref={ref}>
                            <NavLink className="navbar__link bell_icon" onClick={OpenPopup}>
                                {unread && <span className="notifi"></span>}
                                <img src={fi_bell} alt="Notifications"/>
                            </NavLink>
                            {isOpen && (
                                <div className="notification-popup">
                                    <Notification notification={notification} closePopup={closePopup} />
                                </div>
                            )}
                        </li>
                        <li className="user_dropdown">
                            <Dropdown show={showDropdown} onToggle={handleToggle} ref={dropdownRef}>
                                <Dropdown.Toggle id="dropdown-basic">
                                    <div className="user_img"> <img src={profileImage} alt="" /> </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <div className="active_user">
                                        <div className="au_img"> <img src={profileImage} alt="" /> </div>
                                        <p className="mb-0 au_name"> {profileName}</p>
                                    </div>

                                    <Link className="dropdown-item d-block d-lg-none" to='/dashboard' onClick={handleLinkClick}><img src={dashboard} alt=""/> Dashboard</Link>
                                    <Link className="dropdown-item d-block d-lg-none" to='/chat' onClick={handleLinkClick}><img src={email} alt="" /> Messages </Link>

                                    {(userData.user_type==='manager' || userData.user_type==='teenager') &&
                                        <Link className="dropdown-item d-block d-lg-none" to='/jobs' onClick={handleLinkClick}>
                                            <img src={briefcase} alt="" /> Jobs
                                        </Link>
                                    }

                                    {(userData.user_type==='parents' || userData.user_type==='teenager') &&
                                        <Link className="dropdown-item" to="/wallet"> <img src={wallet} alt=""/> Wallet  </Link>
                                    }

                                    {/* {(userData.user_type==='manager' || userData.user_type==='subuser' || userData.user_type==='teenager') &&

                                    } */}

                                    <Link className="dropdown-item" to="/resources"> <img src={resource} alt="" /> Resources </Link>



                                    {(userData.user_type==='teenager') &&
                                        <>
                                            <Link className="dropdown-item d-block d-xl-none" to="/learning-path"> <img src={LMS} alt=""/> Learn </Link>

                                            <Link className="dropdown-item d-block d-xl-none" to="/my-learning">
                                                <img src={learning} alt="" />
                                                <span> My Learning </span>
                                            </Link>
                                        </>
                                    }

                                    {(userData.user_type==='manager' && (userData.employer_type==='Franchise' || userData.employer_type==="Multi-Location Operator")) &&
                                        <Link className="dropdown-item d-block d-xl-none" to="/manage-sub-user">
                                            <img src={subusers} alt="" />
                                            <span> Sub Users </span>
                                        </Link>
                                    }

                                    {(userData.user_type==='manager') &&
                                        <Link className="dropdown-item d-block d-xl-none" to="/subscription">
                                            <img src={subusers} alt="" />
                                            <span> Subscription </span>
                                            {userData.subscription_status && <sup className="pp_title">{userData.plan_id.plan_name}</sup>}
                                        </Link>
                                    }

                                    { userData.user_type==='manager' && (userData.employer_type==='Franchise' || userData.employer_type==="Multi-Location Operator") && <Link className="dropdown-item d-block d-lg-none" to='/manage-sub-user' onClick={handleLinkClick}><img src={user_ico} alt="" /> Sub User</Link>}

                                    {userData.user_type==='teenager' &&
                                        <Link className="dropdown-item d-block d-xl-none" to='/guidance-counselor' onClick={handleLinkClick}>
                                            <img src={consultation} alt="" />  Guidance Counselor
                                        </Link>
                                    }

                                    {(userData.user_type==='parents' || userData.user_type==='teenager') &&
                                    <>
                                    <Link className="dropdown-item d-block d-xl-none" to='/leaderboard'>
                                        <img src={Leaderboard} alt="" />  Leaderboard
                                    </Link>

                                    <Link className="dropdown-item" to='/products'>
                                        <img src={Rewards} alt="" /> Reward Store
                                    </Link>

                                    <Link className="dropdown-item" to='/product-orders'>
                                        <img src={RewardOrders} alt="" />  Reward Orders
                                    </Link>
                                    </>}

                                   {/*  { userData.user_type==='parents' && <Link className="dropdown-item d-block d-lg-none" to='/progress-dashboard'>
                                        <img src={ProgressDashboard} alt="" /> Progress Dashboard
                                    </Link> } */}

                                    <div className="nested_dropdown">
                                        <Dropdown>
                                            <Dropdown.Toggle id="nested-dropdown-toggle"><img src={u_brightness} alt="" /> Appearance </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => changeTheme('light')}><img src={u_brightness_low} alt="" /> Light <span className={'light' === theme ? 'select_color' : 'd-none'}><img src={u_check} alt="" /></span> </Dropdown.Item>
                                                <Dropdown.Item onClick={() => changeTheme('dark')}><img src={u_moon} alt="" /> Dark <span className={'dark' === theme ? 'select_color' : 'd-none'}><img src={u_check} alt="" /></span> </Dropdown.Item>
                                                <Dropdown.Item onClick={() => getInitialTheme()}><img src={u_desktop} alt="" /> Same as device </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                    <Dropdown.Item  onClick={() => { openSettingModal(); handleLinkClick(); }}>
                                        <img src={u_setting} alt="" /> Settings
                                    </Dropdown.Item>


                                    <Dropdown.Divider />

                                    <Dropdown.Item onClick={() => { logout(); handleLinkClick(); }}><img src={fi_logout} alt="" /> Log Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </li>
                    </ul>

                </div>
            </Container>
        </header>


        {/* modal */}
        <Modal
            show={sessionOut}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header>
            <Modal.Title style={{textAlign: 'center', width: '100%'}}>Your session is about to expire!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal_content ">
                    {/* <CountdownTimer /> */}
                    <div className="counter-text">
                        <p>You will be logged out in</p>
                        <div id="counter" className="countdown-animation">{seconds < 10 ? `0${seconds}` : seconds}<span>sec</span></div>
                        <p>Do you want to stay signed in? Please click on the continue button.</p>
                    </div>
                    <button type="button" onClick={() => window.location.reload()} className="btn continue_btn">Continue</button>
                </div>
            </Modal.Body>

        </Modal>

        </>
    )
};

export default Header;