import React from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left.svg';

function LiveChat({onBackClick}) {

    return(
        <>
            <div className="heading_block">
                <button type="button" className="back_btn" onClick={onBackClick}><img src={BackArrow} alt="" /></button>
                <h1 className="heading">Live Chat </h1>
            </div>
        </>
    );
}

export default LiveChat;

