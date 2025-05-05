import React,{ useCallback, useEffect, useState, useLayoutEffect, useRef  } from "react";
import { Skeleton } from 'primereact/skeleton';
import Person from '../../assets/images/Person.svg';
import File from '../../assets/images/file.svg';
import Download from '../../assets/images/download-white.png';
import Communication from '../../assets/images/communication.png';
import { useProfile } from '../../ProfileContext';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import AudioPlayer from './AudioPlayer';
import playicon from '../../assets/images/play_icon.png';

import {Image, SlideshowLightbox} from "lightbox.js-react"

const MessageBody = ({ messages, senderimage, loading,  recevierimage, room, getMessages, hasMore, scrollOffset,setScrollOffset }) => {

    const { profileImage, profileName  } = useProfile();


    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const getFileExtension = (input) => {
        // Check if the input is a valid URL and does not contain base64 data
        if (isValidUrl(input) && !input.toString().includes("data:")) {
            const parts = input.split('.');
            return parts[parts.length - 1].split('?')[0]; // Handle query strings
        }

        // Check if the input is a Blob
        else if (input instanceof Blob) {
            const mimeType = input.type; // Get the MIME type of the Blob
            if (mimeType) {
                const ext = (mimeType.split('/')[1]).split(';')[0];
                return ext; // Return the extension extracted from the MIME type
            } else {
                return null; // Handle cases where the Blob has no MIME type
            }
        }

        // Check if the input is a base64 data URL
        else {
            const [metadata, data] = input.split(',');
            const mimeMatch = metadata.match(/:(.*?);/);
            if (mimeMatch) {
                const mimeType = mimeMatch[1];
                const ext = mimeType.split('/')[1];
                return ext; // Return the extension extracted from the MIME type
            } else {
                return null; // Handle cases where metadata is not in the expected format
            }
        }
    };

    const downloadFile_ = async (input) => {
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

    const downloadFile = async (input) => {
        let fileName = `file-${Date.now()}`;
        let fileExtension = await getFileExtension(input); // Ensure the function is async for Blob URLs
        let fileBlob;

        if (isValidUrl(input)) {
            if (input.startsWith("blob:")) {
                // Handle blob URLs
                const response = await fetch(input);
                fileBlob = await response.blob();
                const mimeType = fileBlob.type;
                fileExtension = fileExtension || mimeType.split('/')[1]; // Fallback to MIME type if extension is missing
            } else {
                // Handle regular URLs
                const response = await fetch(input);
                fileBlob = await response.blob();
            }
            fileName += `.${fileExtension}`;
        } else if (input instanceof Blob) {
            // Handle Blob objects directly
            fileBlob = input;
            const mimeType = fileBlob.type;
            fileExtension = fileExtension || mimeType.split('/')[1]; // Fallback to MIME type if extension is missing
            fileName += `.${fileExtension}`;
        } else {
            // Handle Base64 input
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
            fileExtension = fileExtension || mimeType.split('/')[1]; // Fallback to MIME type if extension is missing
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


    const LoadMore = () => {
        setTimeout(() => {
            getMessages(room?.roomkey);
        },)
    }

    const [infiniteRef, { rootRef }] = useInfiniteScroll({
        loading,
        hasNextPage:hasMore,
        onLoadMore: LoadMore,
        disabled: false,
        rootMargin: '400px 0px 0px 0px',
    });


    // We keep the scroll position when new items are added etc.
    const scrollableRootRef = useRef(null);
    const lastScrollDistanceToBottomRef = useRef();

    useLayoutEffect(() => {
        const scrollableRoot = scrollableRootRef.current;
        const lastScrollDistanceToBottom =
        lastScrollDistanceToBottomRef.current ?? 0;
        if (scrollableRoot) {
        scrollableRoot.scrollTop =
            scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
        }
    }, [messages, rootRef]);

    const rootRefSetter = useCallback(
        (node: HTMLDivElement) => {
            rootRef(node);
            scrollableRootRef.current = node;
        },
        [rootRef],
    );

    const handleRootScroll = useCallback(() => {
        const rootNode = scrollableRootRef.current;
        if (rootNode) {
            const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
            lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
        }
    }, []);


    let lastDate = null; // This will hold the last displayed date


    return (

        <div className='message_body' id="scrollableDiv" ref={rootRefSetter}  onScroll={handleRootScroll} style={{overflow: "auto"}}>

            {!room?.roomkey &&
                <div className="welcome_section">
                    <div className="wel_content_block">
                        <div className="welcome_img">  <img src={profileImage} alt="profile_image" /> </div>
                        <h2 className="wel-text"> Welcome! <span className="wel_user"> {profileName} </span> </h2>
                    </div>
                    <div className="welcome_card_img"> <img src={Communication} alt="" />  </div>

                </div>
            }

            {messages.length > 0 && hasMore && (
                <div ref={infiniteRef}>Loading...</div>
            )}

            {
                messages.length > 0 && messages.map((msg, index) => {
                    const currentDateString = formatDate(msg.date); // Format date using the logic
                    // Only show the date if it's different from the last displayed date
                    const showDate = lastDate !== currentDateString;
                    lastDate = currentDateString;

                    const messageKey = `msg_${index}`; // Use unique id if available, otherwise fall back to index
                    const imageKeyPrefix = `img_${index}_`;

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
                                    {/* window.convertUrlsToLinks */}
                                    {msg.message && <div className='m-content' dangerouslySetInnerHTML={{ __html: (msg.template||msg.message) }}></div>}

                                    { msg.images && msg.images.map((image, i) => {

                                        const fileExtension = getFileExtension(image);

                                        const isDocument = ['pdf', 'doc', 'docx', 'vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileExtension);
                                        return (
                                            <div key={`${imageKeyPrefix}${i}`} className='m-content d-file' style={{background: "none"}} >
                                                {fileExtension === 'mp4' ? (

                                                    isValidUrl(image) && msg.thumbnail?

                                                    <SlideshowLightbox images={[
                                                        {
                                                          type: "htmlVideo",
                                                          videoSrc:image,
                                                          thumbnail: msg.thumbnail,
                                                          alt: ""
                                                        }]}
                                                        lightboxIdentifier={`lbox${imageKeyPrefix}${i}`}
                                                        showThumbnails={false}
                                                        showControls={false}
                                                    >
                                                        <a href="#" className="popup-video">
                                                            <span className="play_icon">
                                                                <img src={playicon} alt="play"  data-lightboxjs={`lbox${imageKeyPrefix}${i}`}/>
                                                            </span>
                                                            <img
                                                                src={msg.thumbnail}
                                                                alt="Uploaded"
                                                                style={{ maxWidth: '100%', borderRadius: '10px' }}
                                                            />
                                                        </a>
                                                    </SlideshowLightbox>
                                                    :<video
                                                        src={isValidUrl(image)?image:URL.createObjectURL(image)}
                                                        style={{ maxWidth: '100%' }}
                                                        controls
                                                    ></video>

                                                ) : (fileExtension === 'webm'||fileExtension === 'mp3' || fileExtension === 'wav' || fileExtension === '3gp' || fileExtension === '3gpp') ? (
                                                    <>
                                                        <AudioPlayer sources={[isValidUrl(image)?image:URL.createObjectURL(image)]} />
                                                    </>
                                                    ) : (

                                                    !isDocument?
                                                    <Image image={{src: image, title: "Uploaded"}} />
                                                    :
                                                    <img
                                                        src={isDocument ? File : image}
                                                        alt="Uploaded"
                                                        style={{ maxWidth: '100%' }}
                                                    />

                                                )}
                                                <div className="chat_download_btn" onClick={() => downloadFile(image)}>
                                                    <img src={Download} alt="Uploaded" />
                                                </div>
                                            </div>
                                        );
                                    }) }


                                    <span className="chat_time">
                                        {window.formatDate2(msg.date, 'hh:mm A')}
                                    </span>
                                </div>
                            </div>


                        </React.Fragment>
                    );

                })
            }


        </div>
    );

};

export default MessageBody;
