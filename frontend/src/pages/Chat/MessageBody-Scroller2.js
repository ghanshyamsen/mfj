import React,{ useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from 'primereact/skeleton';
import Person from '../../assets/images/Person.svg';
import File from '../../assets/images/file.svg';
import Download from '../../assets/images/download-white.png';
import Communication from '../../assets/images/communication.png';
import { useProfile } from '../../ProfileContext';
import InfiniteScroll from 'react-infinite-scroll-component';

const MessageBody = ({ messages, messageBodyRef, senderimage, recevierimage, loading, room, getMessages, hasMore, scrollOffset,setScrollOffset }) => {

    const { profileImage, profileName  } = useProfile();
    const scrollableDivRef = useRef(null);

    // State to track if this is the first load
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const getFileExtension = (input) => {

        if (isValidUrl(input) && !input.toString().includes("data:")) {
            const parts = input.split('.');
            return parts[parts.length - 1].split('?')[0]; // This handles potential query strings
        } else {
            const [metadata, data] = input.split(',');
            const mimeMatch = metadata.match(/:(.*?);/);
            if (mimeMatch) {
                const mimeType = mimeMatch[1];
                const ext = mimeType.split('/')[1];
                return ext;
            } else {
                return null; // Or handle error if metadata is not in expected format
            }
        }
    };

    const downloadFile = async (input) => {
        let fileName = `file-${Date.now()}`;
        let fileExtension = getFileExtension(input);
        let fileBlob;

        if (isValidUrl(input)) {
          // Download from URL
          const response = await fetch(input);
          fileBlob = await response.blob();
          fileName += `.${fileExtension}`;
        } else {
          // Download from Base64
          const [metadata, data] = input.split(',');
          const mimeMatch = metadata.match(/:(.*?);/);
          const mimeType = mimeMatch ? mimeMatch[1] : '';
          const byteString = atob(data);
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
          }
          fileBlob = new Blob([uint8Array], { type: mimeType });
          fileName += `.${fileExtension}`;
        }

        // Create a link element, set its href to the blob URL, and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileBlob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // Check if the date is today
        if (date.toDateString() === today.toDateString()) {
            return "Today";
        }

        // Check if the date is yesterday
        if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        // If not today or yesterday, format the date
        return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    };

    let lastDate = null; // This will hold the last displayed date

    return (
        //
        <div className='message_body' id="scrollableDiv" ref={messageBodyRef} ref={scrollableDivRef} style={{display: 'flex',flexDirection: 'column-reverse'}}>

            {!room?.roomkey &&
                <div className="welcome_section">
                    <div className="wel_content_block">
                        <div className="welcome_img">  <img src={profileImage} alt="profile_image" /> </div>
                        <h2 className="wel-text"> Welcome! <span className="wel_user"> {profileName} </span> </h2>
                    </div>
                    <div className="welcome_card_img"> <img src={Communication} alt="" />  </div>

                </div>
            }

            {messages.length > 0 && <InfiniteScroll
                dataLength={messages.length} //This is important field to render the next data
                next={() => setTimeout(() => { getMessages(room?.roomkey) }, 500) }
                hasMore={hasMore}
                inverse={true}
                scrollableTarget="scrollableDiv"
                loader={<h4>Loading...</h4>}
            >
                {
                    messages.map((msg, index) => {
                        const currentDateString = formatDate(msg.date); // Format date using the logic
                        // Only show the date if it's different from the last displayed date
                        const showDate = lastDate !== currentDateString;
                        lastDate = currentDateString;

                        const messageKey = `msg_${index}`; // Use unique id if available, otherwise fall back to index
                        const imageKeyPrefix = `img_${index}_`;

                        if (loading) {
                            return (
                                <div key={messageKey} className={!msg.fromSelf ? 'mess_left' : 'mess_right'}>
                                    <div className='m_user'>
                                        <Skeleton shape="circle" size="100%" />
                                    </div>
                                    <div>
                                        <Skeleton width="10rem" height="1rem" className="mb-1" />
                                        {msg.images && msg.images.map((image, i) => (
                                            <div key={`${imageKeyPrefix}${i}`} className='m-content'>
                                                <Skeleton width="100%" height="8rem" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <React.Fragment key={messageKey}>
                                    {showDate && (
                                        <p className="message_time">
                                            <span>{currentDateString}</span>
                                        </p>
                                    )}
                                    <div className={!msg.fromSelf ? 'mess_left' : 'mess_right'}>
                                        <div className='m_user'>
                                            <img src={!msg.fromSelf ? recevierimage : senderimage} alt="User" />
                                        </div>
                                        <div>
                                            {msg.message && <div className='m-content' dangerouslySetInnerHTML={{ __html: window.convertUrlsToLinks(msg.message) }}></div>}
                                            {msg.images && msg.images.map((image, i) => {
                                                const fileExtension = getFileExtension(image);
                                                const isDocument = ['pdf', 'doc', 'docx', 'vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileExtension);
                                                return (
                                                    <div key={`${imageKeyPrefix}${i}`} className='m-content d-file' onClick={() => downloadFile(image)}>
                                                        <span className="chat_download_btn">
                                                            <img src={Download} alt="Uploaded" />
                                                            {msg.originalname[i]}
                                                        </span>
                                                        <img
                                                            src={isDocument ? File : image}
                                                            alt="Uploaded"
                                                            style={{ maxWidth: '100%' }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                            <span className="chat_time">
                                                {window.formatDate2(msg.date, 'HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        }
                    })
                }
            </InfiniteScroll>}
        </div>
    );

};

export default MessageBody;
