import React, { useState, useEffect } from 'react';
import BackArrow from '../../assets/images/fi_arrow-left.svg';
import Badge from '../../assets/images/cil_badge.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import { useOnlineUsers } from '../../OnlineUsersContext';

const ChatHeader = ({selectedConversation, showConversationList, assignBadge}) => {

  const loguser = JSON.parse(localStorage.getItem('userData'));

  const [loading, setLoading] = useState(true);
  const [badgeList, setBadgeList] = useState([]);
  const onlineUsers = useOnlineUsers();

  const isUserOnline = onlineUsers.hasOwnProperty((selectedConversation?.userId||''));

  const TOKEN = localStorage.getItem('token');

  useEffect(() => {
    getBadges();
  },[])

  const getBadges = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-badge-list`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.status){
          setBadgeList(result.data);
        }
      })
      .catch((error) => console.error(error.message));
  }

  useEffect(() => {

    if(Object.keys(selectedConversation).length > 0){
      setLoading(false)
    }
  }, [selectedConversation]);

  return (
    <>
      {selectedConversation.first_name && <div className='chat_user'>
        <div className='back_arrow' onClick={showConversationList}><img src={BackArrow} alt="" /></div>
        {selectedConversation.profile_image && <div className='user_img'>
          {( <img src={selectedConversation.profile_image} alt="Name" /> )}
        </div>}

        <div className='nameandstatus'>
          {loading ? (
            <>
              {/* <Skeleton width="10rem" height="1rem" className='mb-1' />
              <Skeleton width="6rem" height="1rem" style={{ marginTop: '0.5rem' }} /> */}
            </>
          ) : (
            <>
              <p className='user_name'>{selectedConversation.first_name} {selectedConversation.last_name}</p>
              {isUserOnline && <p className='status'>Online</p>}
            </>
          )}
        </div>
        {(loguser?.user_type==='manager' || loguser?.user_type==='subuser') && <div className='badge_select'>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              <div className='badge_icon'> <img src={Badge} alt="" /> </div> <span> Assign Badge </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {
                badgeList.map((badge) => (
                  <Dropdown.Item onClick={()=>{assignBadge(badge)}} key={badge.id}> <img src={badge.image} alt="" /> {badge.title}</Dropdown.Item>
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>}
      </div>}


    </>
  );
};

export default ChatHeader;
