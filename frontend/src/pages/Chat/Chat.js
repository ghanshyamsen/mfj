import React, { useState, useEffect, useRef, useCallback } from 'react';
import './chat.css';

import MessageInput from './MessageInput';
import MessageBody from './MessageBody';
import ConversationList from './ConversationList';
import ChatHeader from './ChatHeader';

import RecordRTC from 'recordrtc';

import socket from '../../socket';
import { debounce } from 'lodash';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Voice from '../../assets/images/voice-assistant.png';
import VoiceColor from '../../assets/images/voice-assistant-color.png';

function Chat() {

  const url = new URL(window.location.href);
  const roomId = url.searchParams.get('room');
  const TOKEN = localStorage.getItem('token');

  const User = JSON.parse(localStorage.getItem('userData'));

  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState({});
  const [room, setRoom] = useState(roomId);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isloadBottom, setIsloadBottom] = useState(false);
  const [resume, setResume] = useState({});


  /** Recording */
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null); // URL of the recorded video
  const [audioUrl, setAudioUrl] = useState(null); // URL of the recorded video
  const [videoBlob, setVideoBlob] = useState(null); // URL of the recorded video
  const [audioBlob, setAudioBlob] = useState(null); // URL of the recorded video

  const videoPreviewRef = useRef(null); // Ref for the live preview video
  const recorderRef = useRef(null); // Ref for the RecordRTC instance
  const streamRef = useRef(null); // Ref for the media stream
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState(0);
  const [mediatype, setMediaType] = useState('video');
  const [mediaLoad, setMediaLoad] = useState(false);


  const handleClose = () => {

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setShowAudioRecorder(false);
    setShowVideoRecorder(false);
    setIsRecording(false);
    setVideoURL(null);
    setAudioUrl(null);
    setSeconds(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

  };

  const handleShowAudioRecorder = () => setShowAudioRecorder(true);
  const handleShowVideoRecorder = () => setShowVideoRecorder(true);

  const startRecording = async () => {
    try {


      let mediaConstraints;
      if (mediatype === 'audio') {
        mediaConstraints = { audio: true }; // Audio-only
      } else if (mediatype === 'video') {
        mediaConstraints = { video: true, audio: true }; // Audio + Video
      } else {
        throw new Error('Invalid media type specified');
      }

      // Request access to the user's camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      streamRef.current = stream;

      // Assign the stream directly to the video element's srcObject for live preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play(); // Start the live preview
      }

      // Initialize RecordRTC for video recording
      const recorder = new RecordRTC(stream, {
        type: mediatype,
        mimeType: `${mediatype==='video'?'video/mp4':'audio/webm'}`, // Default MIME type for recording
      });

      recorder.startRecording();
      recorderRef.current = recorder;

      setIsRecording(true);
      setSeconds(30);
      setVideoURL(null);
      setAudioUrl(null);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Error accessing media devices. Please check permissions or hardware.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        const videoURL = URL.createObjectURL(blob);

        // Set the recorded video URL for playback
        if(mediatype === 'video') {
          setVideoBlob(blob);
          setVideoURL(videoURL);
        }else{
          setAudioBlob(blob);
          setAudioUrl(videoURL);
        }

        // Stop the media stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Clear the live preview
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      });

      setSeconds(false);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if(!seconds){
          stopRecording();
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  /** End */

  useEffect(() => {

    setLoading(true);
    debouncedGetMessages(selectedConversation?.roomkey);
    readMessages(selectedConversation?.roomkey);
    if (selectedConversation) {
      socket.emit('joinRoom', selectedConversation?.roomkey);
    }

    const handleMessageReceive = (message) => {

      if(message.room === selectedConversation.roomkey){

        if(message?.sender === User._id){
          message.fromSelf = true;
        }

        if(message?.mediatype){

          setMessages([]);
          setMessageCount(() => {
            return 0;
          });

          setMediaLoad(true);

        }else{
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              fromSelf: message.fromSelf,
              message: message.message,
              template: message.template,
              images: message.images,
              originalname:message.originalname,
              date: new Date(message.date),
              id: message.id
            },
          ]);
        }

        readMessages(selectedConversation.roomkey);

        setCount((prevCount) => prevCount + 1);
      }
    };

    socket.on('receive-message', handleMessageReceive);
    socket.on('receive_notify', (resp) => {
      setCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off('receive-message');
      socket.off('receive_notify');
    };
  }, [selectedConversation]);

  useEffect(() => {
    if(mediaLoad && messageCount === 0){
      debouncedGetMessages(selectedConversation?.roomkey);
      setMediaLoad(false);
    }
  },[messageCount, selectedConversation, mediaLoad]);


  const handleMessageSend = (message) => {
    if(selectedConversation?.roomkey){
      //originalname
      let fileNames = message.files?.map(file => file.name);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          fromSelf: true,
          message: message.content,
          template: message.template,
          images: message.images,
          originalname:fileNames,
          date: new Date(),
          id: window.uuid(),
          sender: User._id
        }
      ]);

      if(!message?.blob){
        socket.emit('send-message', {
          to: selectedConversation.roomkey,
          message: message.content,
          template: message.template,
          images: message.images,
          originalname:fileNames,
          fromSelf: false,
          date: new Date(),
          id: window.uuid(),
          sender: User._id
        });
      }

      setScrollOffset(0);
      saveMessages(message.content, message.template, message.files, message?.blob);

      UpdateUser();
    }
  };

  var isLoadMessage = true;
  const getMessages = (room) => {

    if (isLoadMessage) {
      isLoadMessage = false;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${TOKEN}`);

      const raw = JSON.stringify({
        "room": room,
        "offset": messageCount
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(`${process.env.REACT_APP_API_URL}/app/chat/get-messages`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            const newMessages = result.data || [];
            //setMessages(newMessages);
            if(newMessages.length === 0){
              setHasMore(false);
            }

            setLoading(false);
            setMessages((prevMessages) => [...newMessages, ...prevMessages]);
            setMessageCount((prevCount) => prevCount + newMessages.length);

            setTimeout(() =>{
              isLoadMessage = true;
            },1500)
          } else {
            console.error('Error fetching messages:', result.message);
            setLoading(false);
            isLoadMessage = true; // Reset flag even if there's an error
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          setLoading(false);
          isLoadMessage = true; // Reset flag on fetch error
        });


    }
  };

  const debouncedGetMessages = useCallback(
    debounce((room, count='') => {
      if (room) {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
          "room": room,
          "offset": messageCount
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/chat/get-messages`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result.status) {
              const newMessages = result.data || [];
              if (newMessages.length === 0) {
                setHasMore(false);
              }
              setMessages((prevMessages) => [...newMessages,...prevMessages]);
              setMessageCount((prevCount) => prevCount + newMessages.length);
              setLoading(false);
            } else {
              console.error('Error fetching messages:', result.message);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.error('Fetch error:', error);
            setLoading(false);
          });
      }
    }, 100), // Adjust debounce delay as needed
    [messageCount, TOKEN]
  );

  const readMessages = (room) => {
    if(room){
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${TOKEN}`);

      const raw = JSON.stringify({
        "room": room
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(`${process.env.REACT_APP_API_URL}/app/chat/read`, requestOptions)
      .then((response) => response.json())
      .then((result) => {})
      .catch((error) => console.error(error.message));
    }
  }

  const saveMessages = (message, template, media, blob) => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const formData = new FormData();
    formData.append("room", selectedConversation.roomkey);
    formData.append("from", User._id);
    formData.append("to", selectedConversation.userId);
    formData.append("message", message);
    formData.append("template", template);

    if(media.length > 0){
      media.forEach(file => {
        if(file.blob){
          if(mediatype === "video"){
            const newfile = new File([file.blob], file.name, { type: 'video/mp4' }); // Explicitly set MIME type
            formData.append("media", newfile);
          }else{
            formData.append('media', file.blob, file.name);
          }
        }else{
          formData.append("media", file);
        }
      });
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/chat/send-message`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){

        if(blob){
          socket.emit('send-files', {
            to: selectedConversation.roomkey,
            message: '',  // Send the array of ArrayBuffers
            images: [],
            originalname: [],
            fromSelf: false,
            date: new Date(),
            id: window.uuid(),
            sender: User._id,
            mediatype: mediatype
          });

          setScrollOffset(0);
        }

        setCount((prevCount) => prevCount + 1);
      }
    })
    .catch((error) => console.error(error.message));
  }

  const UpdateUser = () => {
    if(!User?.contact_candidate_completed){

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${TOKEN}`);

      const raw = JSON.stringify({
        contact_candidate_completed: true
      });

      const requestOptions = {
          method: "PATCH",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
      };

      fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${User._id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
          if(result.status === 'success'){
              localStorage.setItem('userData',JSON.stringify(result.data));
          }
      })
      .catch((error) => console.error(error));
    }
  }

  const isMobileView = () => window.matchMedia("(max-width: 600px)").matches;

  const showConversationList = () => {
    if (isMobileView()) {
      setSelectedConversation({});
    }
  }

  const changeConversation = (data) => {
    if(data?.roomkey){
      setMessageCount(0);
      setMessages([]);
      setLoading(true);
      setIsloadBottom(false);
      setTimeout(function () {
        setSelectedConversation(data);
        setCount((prevCount) => prevCount + 1);
        setHasMore(true);
      },500);
    }
  }

  const assignBadge = (data) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const raw = JSON.stringify({
      "candidate_id": selectedConversation.userId,
      "assign_by": User._id,
      "badge_id": data.id,
      "badge_name": data.title,
      "badge_image": data.image
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/assign-badge`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        handleMessageSend({
          content: `{badge}`,
          template:`
            <div class="m-text badge-block"><img class="badge-img" src="${data.image}" width="200px;" /><br/>You got the ${data.title} badge.</div>
          `,
          images: [],
          files: []
        })
      }else{
        window.showToast(result.message, 'error');
      }
    })
    .catch((error) => console.error(error));
  }

  const openRecorder = async (type) => {

    setMediaType(type);

    if(type === "video"){

      handleShowVideoRecorder();

      // Request access to the user's camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
      streamRef.current = stream;

      // Assign the stream directly to the video element's srcObject for live preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play(); // Start the live preview
      }

    }else{
      handleShowAudioRecorder();
    }

  }

  const sendFile = () => {
    // Ensure randomInt is defined
    if (!window.randomInt) {
      window.randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
    }

    let message = mediatype === "video" ? {
      content: "",
      images: [videoBlob],
      files: [{
        blob: videoBlob,
        name: `recording_${window.randomInt(0, 999).toString().padStart(3, '0')}.mp4`,
        type: 'video/mp4'
      }],
      blob: true
    } : mediatype === "audio" ? {
      content: "",
      images: [audioBlob],
      files: [{
        blob: audioBlob,
        name: `recording_${window.randomInt(0, 999).toString().padStart(3, '0')}.webm`,
        type: 'audio/webm' // Ensure this type is correct for your audio file format
      }],
      blob: true
    } : null;

    if (message) {
      handleMessageSend(message);
      handleClose();
    } else {
      console.error("Invalid media type: ", mediatype);
    }

  };

  useEffect(() => {
    if(User.user_type === 'teenager'){
      getResume()
    }

    setInterval(() => {
      //setCount((prevCount) => prevCount + 1);
    },6000)
  },[])

  const getResume = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-resume-builder/${User._id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        setResume(result.data)
      }
    })
    .catch((error) => console.error(error.message));
  }



  return (
    <>
      <div className='message_page common_background_block'>
        <div className={`message_block ${selectedConversation.userId ? 'active' : ''}`}>
          <ConversationList
            User={User}
            selectedConversation={selectedConversation}
            setSelectedConversation={changeConversation}
            room={room}
            setRoom={setRoom}
            messages={messages}
            count={count}
          />
          <div className='chat_modual_block'>
            {selectedConversation && (
              <>
                <ChatHeader showConversationList={showConversationList} selectedConversation={selectedConversation} setMediaType={setMediaType} openRecorder={openRecorder} assignBadge={assignBadge} />
                <MessageBody
                  messages={messages}
                  setMessages={setMessages}
                  senderimage={User.profile_image}
                  recevierimage={selectedConversation.profile_image}
                  loading={loading}
                  room={selectedConversation}
                  getMessages={debouncedGetMessages}
                  hasMore={hasMore}
                  scrollOffset={scrollOffset}
                  setScrollOffset={setScrollOffset}
                />
                <MessageInput onMessageSend={handleMessageSend} room={selectedConversation} openRecorder={openRecorder} resume={resume} />
              </>
            )}
          </div>
        </div>
      </div>


      {/*  */}
      <Modal className='recordingModal' show={showAudioRecorder} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Audio Recording</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="mic-container">
            <div className={`circle ${isRecording?'active':''}`}>
              <img src={VoiceColor} alt="voice" />
              <img src={Voice} alt="voice" />
            </div>
          </div>

          {audioUrl && (
            <div>
              <audio
                src={audioUrl}
                controls
                autoPlay
                style={{ width: '100%'}}
              ></audio>
            </div>
          )}

          {seconds > 0 && <div className='time_range'>{minutes+':'+seconds.toString().padStart(2, '0')}</div>}
        </Modal.Body>
        <Modal.Footer>
          {isRecording ? (
            <button className='start_btn stopbtn' onClick={stopRecording}>Stop Recording</button>
          ) : (
            <button className='start_btn' onClick={startRecording}>{audioUrl?'Restart':'Start'} Recording</button>
          )}
          {audioUrl && !isRecording && <button className='start_btn' onClick={sendFile}> Send </button>}
        </Modal.Footer>
      </Modal>

      <Modal className='recordingModal' show={showVideoRecorder} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Video Recording</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>

            {/* Live preview */}
              <div
                style={{
                  display: videoURL ? 'none' : 'block', // Hide when videoURL is present
                }}
              >
              <video
                ref={videoPreviewRef}
                muted
                autoPlay
                playsInline
                style={{ width: '100%'}}
              ></video>
            </div>

            {/* Recorded video */}
            {videoURL && (
              <div>
                <video
                  src={videoURL}
                  controls
                  autoPlay
                  style={{ width: '100%'}}
                ></video>
              </div>
            )}

            {seconds > 0 && <div className="video_timer">{minutes+':'+seconds.toString().padStart(2, '0')}</div>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isRecording ? (
            <button className='start_btn stopbtn' onClick={stopRecording}>Stop Recording</button>
          ) : (
            <button className='start_btn' onClick={startRecording}>{videoURL?'Restart':'Start'} Recording</button>
          )}
          {videoURL && !isRecording && <button className='start_btn' onClick={sendFile}> Send </button>}
        </Modal.Footer>
      </Modal>


      {/*  */}
    </>
  );

}

export default Chat;
