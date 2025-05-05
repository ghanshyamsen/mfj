import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from 'primereact/skeleton';
import Close from '../../assets/images/close.svg';
import Form from 'react-bootstrap/Form';
import Search from '../../assets/images/search.svg';

const ConversationList = ({User, selectedConversation, setSelectedConversation, room, setRoom, messages, count}) => {

  const [loading, setLoading] = useState(true);
  const TOKEN = localStorage.getItem('token');

  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addActive, setaddActive] = useState('');
  const inputRef = useRef(null);

  const showSearchBar = () => {
    setIsVisible(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  };
  const hideSearchBar = () => {setIsVisible(false); setSearchQuery('') };

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getChatList();
  }, [count]);

  useEffect(() => {
    setInterval(() => {
      getChatList();
    },6000)
  },[])

  const getChatList = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/chat/get-chat-list/${User._id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        setConversations(result.data);
        setLoading(false);
        if(room){
          CallRoom(result.data);
        }

      }
    })
    .catch((error) => console.error(error.message));
  }

  const filteredConversations = conversations.filter(conversation =>
    (conversation.first_name + ' ' + conversation.last_name).toLowerCase().includes(searchQuery.toLowerCase())
  );




  const CallRoom = (data) => {
    if(room){

      setSelectedConversation(data.filter(value => value.roomkey === room)[0]);
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      window.history.replaceState({}, '', url);
      setRoom('')
    }
  }

  return (
    <div className='conversations_block'>

      <div className='conversation_row'>
        <h1 className='con_title'>  {loading ? <Skeleton width="10rem" height="28px" /> : "Conversations" } </h1>

        <div className='search_conversation' onClick={showSearchBar}>
          <img src={Search} alt="Search" />
        </div>

        {isVisible && (
          <div className='search_content_row'>
            <img src={Search} alt="Search" />
            <Form.Control
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={inputRef}
            />
            <span className='close_img' onClick={hideSearchBar}>
              <img src={Close} alt="Close" />
            </span>
          </div>
        )}
      </div>

      <div className='online_users'>
        <ul>
          {
            filteredConversations.length > 0 ? (
              filteredConversations.map((conversation, index) => {

                if(loading){
                  return (
                    <li key={index}>
                      <div className='user_image'>
                        <Skeleton shape="circle" size="100%" />
                      </div>
                      <div className='chat_info'>
                        <Skeleton width="10rem" height="1rem" className='mb-1' />
                        <Skeleton width="6rem" height="1rem" />
                      </div>
                      <Skeleton width="2rem" height="2rem" className='sk_status' />
                    </li>
                  )
                }else{
                  return (
                  <li key={index} onClick={() => {setaddActive(index); setSelectedConversation(conversation)}}  className={selectedConversation.roomkey === conversation.roomkey ? 'active' : ''}>
                    <div className='user_image'>
                      <img src={conversation.profile_image} alt={conversation.first_name} />
                    </div>
                    <div className='chat_info'>
                      <p className='user_name'>{conversation.first_name} {conversation.last_name}</p>
                     {<p className='message_text'>
                        {conversation.latestMessage?<span className='mt'>{window.trimHTMLToText(conversation.latestMessage?.replace('{','')?.replace('}',''))}</span>:(conversation.latestMessageDate && <span className='mt'>New shared item</span>)}
                        {conversation.latestMessageDate && <span>{window.timeAgo(conversation.latestMessageDate)}</span>}
                      </p>}
                    </div>
                    {conversation.unreadCount > 0 && <p className='count'>{conversation.unreadCount}</p>}
                  </li>)
                }
              })
            ) : (

              (
                searchQuery?<p className='notfound'>No search results</p>
                :<p className='notfound'>
                  {User?.user_type==='teenager'?`It looks like you haven’t started any conversations yet. Start a new one to connect with potential employers now!`:
                  (User?.user_type==='manager' || User?.user_type==='subuser'?`It looks like you haven’t started any conversations yet. Start a new one to connect with potential candidates now!`
                    :`It looks like you haven’t started any conversations yet. Add a child to begin communicating with them now, or check back here to keep an eye on your child’s conversations with potential employers.`)
                  }</p>
              )
            )
          }
        </ul>
      </div>

    </div>
  );
};

export default ConversationList;
