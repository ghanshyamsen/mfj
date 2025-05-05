import React from "react";
import './error.css';
import { Link } from "react-router-dom";

function Error404() {
    return (  
        <>
            <div className="error_page">
                <div className="error_block">
                    <h2 className="error_title"> 404 </h2>
                    <p className="error_text"> uh-oh! Nothing </p>
                    <Link to="/" className="btn submit_btn"> Go To Dashboard </Link>
                </div>
            </div>        
        </>
    );
}

export default Error404;