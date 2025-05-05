import React from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left.svg';
import phoneNO from '../../../assets/images/u_phone.svg';
import { Link } from "react-router-dom";

function CallUs({onBackClick}) {

    return(
        <>
            <div className="heading_block">
                <button type="button" className="back_btn" onClick={onBackClick}><img src={BackArrow} alt="" /></button>
                <h1 className="heading"> Call Us </h1>
            </div>

            <div className="setting_common_block">
                <div className='contact_no'> <Link to="tel:9848342943"> <img src={phoneNO} alt="" /> <span> 9848342943 </span> </Link> </div>
            </div>
        </>
    );
}

export default CallUs;

