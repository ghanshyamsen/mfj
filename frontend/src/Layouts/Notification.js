import React from 'react';
import Close from '../assets/images/close.svg';
import { Link } from "react-router-dom";
// function Notification({notification, closePopup}){

//     return (
//         <>
//             <div className='notification_heading_row'>
//                 <h1 className='notification_heading'> Notifications </h1>
//                 <div className='icon_s'>
//                     {/* <div className='dots_icon'><img src={dots} alt="" /> </div> */}
//                     <div className='close_icon' onClick={closePopup}><img src={Close} alt="" /> </div>
//                 </div>
//             </div>

//             <div className='notification_body'>

//                 {
//                     notification.map((value, key) => (
//                         <div className='notification_box' key={key}>
//                             {!value.read && <span className='unread_message'></span>}
//                             <div className='noti_user'> <img src={value.sender.profile_image} alt="" /> </div>
//                             <div className='noti_content_block'>
//                                 <h2 className='n_user_name'>{value.sender.first_name} {value.sender.last_name}</h2>
//                                 <p className='noti_time'>{window.timeAgo(value.createdAt)}</p>
//                                 {value.link?<Link key={key} to={value.link||''} style={{textDecoration:'none'}} onClick={closePopup}>
//                                     <p className='noti_text'>{value.message}</p>
//                                 </Link>:<p className='noti_text'>{value.message}</p>}
//                             </div>
//                         </div>
//                     ))
//                 }
               
             
//                 <p className='notfound'>There are no notifications yet.</p>
              
//             </div>
//         </>
//     );
// }
function Notification({ notification, closePopup }) {
    return (
        <>
            <div className='notification_heading_row'>
                <h1 className='notification_heading'> Notifications </h1>
                <div className='icon_s'>
                    <div className='close_icon' onClick={closePopup}>
                        <img src={Close} alt="" />
                    </div>
                </div>
            </div>

            <div className='notification_body'>
                {notification.length > 0 ? (
                    notification.map((value, key) => (
                        <div className='notification_box' key={key}>
                            {!value.read && <span className='unread_message'></span>}
                            <div className='noti_user'>
                                <img src={value.sender.profile_image} alt="" />
                            </div>
                            <div className='noti_content_block'>
                                <h2 className='n_user_name'>{value.sender.first_name} {value.sender.last_name}</h2>
                                <p className='noti_time'>{window.timeAgo(value.createdAt)}</p>
                                {value.link ? (
                                    <Link key={key} to={value.link || ''} style={{ textDecoration: 'none' }} onClick={closePopup}>
                                        <p className='noti_text'>{value.message}</p>
                                    </Link>
                                ) : (
                                    <p className='noti_text'>{value.message}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='notfound' style={{ textAlign: 'center', marginTop: '20px' }}>There are no notifications yet.</p>
                )}
            </div>
        </>
    );
}





export default Notification;