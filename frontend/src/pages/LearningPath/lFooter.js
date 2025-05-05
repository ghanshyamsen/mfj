import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from '../../assets/images/logo.png'
import Facebook from '../../assets/images/facebook.png'
import Youtube from '../../assets/images/youtube.png'
import Instagram from '../../assets/images/instagram.png'
import Apply from '../../assets/images/apply.png'
import Playstore from '../../assets/images/playstore.png'

import { Link } from "react-router-dom";

function Footer(){

    const config = JSON.parse(localStorage.getItem('ConfigData'));

    return(
        <>
            <footer>
                <div className='common_container'>
                    <Row>
                        <Col md={3}>
                            <div className='footer_left_menu'>
                                <div className='site_logo'> <img src={Logo} alt="" /> </div>
                                <p className='untext'> Unlock your potential </p>
                                <ul className='social_menu'>
                                    <li> <Link to={config.facebook_link} target="_blank"> <img src={Facebook} alt="" /> </Link> </li>
                                    <li> <Link to={config.youtube_link} target="_blank"> <img src={Youtube} alt="" /> </Link> </li>
                                    <li> <Link to={config.instagram_link} target="_blank"> <img src={Instagram} alt="" /> </Link> </li>
                                </ul>
                            </div>
                        </Col>
                        <Col md={6}>
                            {/* <div className='footer_menu_block'>
                                <div className="footer_menu">
                                    <h2 className='fm_title'> Plans </h2>
                                    <ul className=''>
                                        <li> <Link to=""> First link </Link> </li>
                                        <li> <Link to=""> Second link </Link> </li>
                                        <li> <Link to=""> Third link </Link> </li>
                                        <li> <Link to=""> Fourth link </Link> </li>
                                    </ul>
                                </div>
                                <div className="footer_menu">
                                    <h2 className='fm_title'> Resources </h2>
                                    <ul className=''>
                                        <li> <Link to=""> Fifth link </Link> </li>
                                        <li> <Link to=""> Sixth link </Link> </li>
                                        <li> <Link to=""> Seventh link </Link> </li>
                                        <li> <Link to=""> Eighth link </Link> </li>
                                    </ul>
                                </div>
                                <div className="footer_menu">
                                    <h2 className='fm_title'> Connect </h2>
                                    <ul className=''>
                                        <li> <Link to=""> Ninth link </Link> </li>
                                        <li> <Link to=""> Tenth link </Link> </li>
                                        <li> <Link to=""> Eleventh link </Link> </li>
                                    </ul>
                                </div>
                            </div> */}
                        </Col>
                        <Col md={3}>
                            <div className='app_link_block'>
                                <h3 className='alb_heading'> Get our mobile app </h3>
                                <Link to={config.android_app_link} className='btn app_btn' target="_blank">
                                    <img src={Apply} alt="" />
                                    <span>
                                        <small> Download on the </small>
                                        App Store
                                    </span>
                                </Link>
                                <Link to={config.ios_app_link} className='btn app_btn' target="_blank">
                                    <img src={Playstore} alt="" />
                                    <span>
                                        <small> GET IT ON </small>
                                        Google Play
                                    </span>
                                </Link>
                            </div>

                        </Col>
                    </Row>
                </div>
            </footer>
        </>
    )
}

export default Footer;