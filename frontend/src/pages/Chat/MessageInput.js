import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import DeleteIcon from '../../assets/images/fi_x.svg';
import Attech from '../../assets/images/attech.svg';
import Send from '../../assets/images/send.svg';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import File from '../../assets/images/file.svg';
import Video from '../../assets/images/video.png';
import VideoBlock from '../../assets/images/video-block.png';

import VideoColor from '../../assets/images/video-color.png';
import Voice from '../../assets/images/voice-assistant.png';
import VoiceBlock from '../../assets/images/voice-block.png';

import VoiceColor from '../../assets/images/voice-assistant-color.png';
import More from '../../assets/images/more.png';
import MoreColor from '../../assets/images/morecolor.png';
import Dropdown from 'react-bootstrap/Dropdown';
import Attach from '../../assets/images/attach.png';
import AttachBlock from '../../assets/images/attach-block.png';

import AttachColor from '../../assets/images/attachcolor.png';
import Question from '../../assets/images/question.png';
import QuestionColor from '../../assets/images/questioncolor.png';
import Scheduled from '../../assets/images/reminder.png';
import ProfileCard from '../../assets/images/profilecard.svg';
import PencilAi from '../../assets/images/Pencilai.png';
import Copy from '../../assets/images/u_copy.svg';

import Mail from '../../assets/images/fi_mail.svg';
import Phone from '../../assets/images/u_phone.svg';
import Location from '../../assets/images/u_map-marker-alt.svg';

import { Tooltip } from 'primereact/tooltip';


import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const MessageInput = ({ onMessageSend, room, openRecorder, resume }) => {
  const loguser = JSON.parse(localStorage.getItem('userData'));
  const TOKEN = localStorage.getItem('token');

  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [generateSuggest, setGenerateSuggest] = useState('');
  const [suggestionModel, setSuggestionModel] = useState(false);
  const [letterLoading, setLetterLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const inputFileRef = useRef(null);
  const inputRef = useRef(null); // Create a ref for the input field

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false)
    setSuggestionModel(false)
  };

  useEffect(() => {
    getTemplates();
  },[])

  useEffect(() => {
    inputRef.current?.focus();
  },[inputRef.current])

  const handleFileChange = (event) => {

    const files = Array.from(event.target.files);
    const previews = files.map(file => {
      if(file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg'){
        const reader = new FileReader();
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      }else{
        const index = files.indexOf(file);
        if (index > -1) {
          files.splice(index, 1);
        }
        return null;
      }
    });

    if(previews[0]){
      setDisabled(false);
      Promise.all(previews).then(previewUrls => {
        if(previewUrls){
          setImages(prevImages => [...prevImages, ...files]);
          setImagePreviews(prevPreviews => [...prevPreviews, ...previewUrls]);
        }
      });
    }else{
      setDisabled(true);
    }
  };

  const handleRemoveImage = (index) => {
    const restImages = images.filter((_, i) => i !== index);

    setImages(prevImages => restImages);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));

    if(restImages.length === 0) {
      setDisabled(true);
    }

  };

  const handleSend = () => {
    if (message.trim() || images.length > 0) {

      setLoading(true);

      const readerPromises = images.map(file => {
        const reader = new FileReader();
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readerPromises).then(imageUrls => {
        onMessageSend({ content: (message?message:''), template:(message?`<div class="m-text">${window.convertUrlsToLinks(message)}</div>`:''), images: imageUrls, files:images });
        setMessage('');
        setImages([]);
        setImagePreviews([]);
        setLoading(false);
        setDisabled(true);
      });

      inputRef.current.focus();
    }

  };

  const getFileExtension = (input) => {
    if(input){
      const [metadata, data] = input.split(',');
      const mimeMatch = metadata.match(/:(.*?);/);
      if (mimeMatch) {
        const mimeType = mimeMatch[1];
        const ext = mimeType.split('/')[1];
        return ext;
      } else {
        return null; // Or handle error if metadata is not in expected format
      }
    }else{
      return null; // Or handle error if metadata is not in expected format
    }
  };

  const handleSuggestionClick = (text) => {
    setMessage(text); // Update the message state
    setShowSuggestions(false); // Hide suggestions after selecting one
    setDisabled(false); // Enable the send button
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      handleSend(); // Call the send message function
    }
  };

  const sendProfileCard = () => {

    var list = '';
    resume.skills?.map(skill => list += `<li>${skill.name}</li>` );
    let card = `
      <div class="profileCard">
        <div class="profileImg"> <img src="${loguser?.profile_image}" alt="" /> </div>
        <div class="profile_body">
          <h2 class="profileName"> ${loguser?.first_name} ${loguser?.last_name} </h2>
          <div class="" style="background: #ffdfcf; padding: 8px 10px 2px; border-radius: 10px; margin-bottom: 10px;">
            <p class="info"> <img src=${Mail} alt=""/> ${loguser?.email}</p>
            <p class="info"> <img src=${Phone} alt=""/> ${loguser?.phone_number} </p>
            <p class="info"> <img src=${Location} alt=""/> ${loguser?.location} </p>
          </div>
          <p class="topinfo ${list===''?'d-none':''}"><span>Top Skills</span></p>
          <ul>${list}</ul>
        </div>
      </div>
    `

    onMessageSend({ content: `{profile_card}`, template:card,  images: [], files:[] });
  }

  const getSuggestion = async () => {

    setSuggestionModel(true);
    setLetterLoading(false);

    // , and suggestions Provide 3 to 4 different suggestions, and number them starting from 1. Each suggestion should be on a new line.
    const prompt = `
      Please improve the following message by enhancing the grammar and emotions.
      Only return the improved message without any additional headings or comments.

      ${message}
    `;

    try {
      const response = await window.getOpenAIResponse(prompt)
      setGenerateSuggest(response);
      setLetterLoading(true);

    } catch (error) {
      console.error('Failed to get OpenAI response:', error.message);
    }

  }

  const getTemplates = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-message-template?type=${loguser?.user_type==='teenager'?'student':'employer'}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        setMessagesList(result.data)
      }
    })
    .catch((error) => console.error(error));
  }

  const setReminder = () => {

    let errors = {};
    if(!formData.message){
      errors.message = "Message is required";
    }

    if(!formData.date){
      errors.date = "Date/Time is required";
    }

    // if(!formData.time){
    //   errors.time = "Time is required";
    // }

    if(Object.keys(errors).length > 0){
      setErrors(errors);
      return
    }
    setErrors({});

    handleClose();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const raw = JSON.stringify({
      "from": loguser._id,
      "to": loguser._id,
      "message": (formData.message||''),
      "date": (formData.date||''),
      "time": (formData.date||''),
      "status": false
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/set-reminder`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        window.showToast(result.message, "success");
        setFormData({});
      }else{
        window.showToast(result.message, "error");
      }
    })
    .catch((error) => console.error(error.message));
  }

  const handleChange = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value});
  }

  const copyToClipboard = () => {
    if (navigator.clipboard) {

      navigator.clipboard.writeText(generateSuggest).then(() => {
        window.showToast("Message copied to clipboard!", 'success');
      }).catch(console.error);

    } else {

      const textArea = document.createElement('textarea');
      textArea.value = generateSuggest;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        window.showToast("Message copied to clipboard!", 'success');
      } catch (err) {
        window.showToast("Failed to copy message: " + err, 'error')
      }

      document.body.removeChild(textArea);

    }
  };

  return (
    <div className='message_writter_block'>
      {loading ? (
        <Skeleton width="100%" height="5rem" />
      ) : (

        <>
          {imagePreviews.length > 0 && (
            <div className='image_preview'>
              {imagePreviews.map((preview, index) => {
                return preview && (
                  <div key={index} className='image_preview_item'>
                    {(getFileExtension(preview) !== 'pdf' && getFileExtension(preview) !== 'doc' && getFileExtension(preview) !== 'vnd.openxmlformats-officedocument.wordprocessingml.document' && getFileExtension(preview) !== 'docx') && <img src={preview} alt="Preview" style={{ maxWidth: '100%', marginBottom: '10px' }} />}
                    {(getFileExtension(preview) === 'pdf' || getFileExtension(preview) === 'doc' || getFileExtension(preview) === 'vnd.openxmlformats-officedocument.wordprocessingml.document' || getFileExtension(preview) === 'docx' ) && <img src={File} alt="Preview" style={{ maxWidth: '100%', marginBottom: '10px' }} />}
                    <img src={DeleteIcon} alt="Delete" className='delete_icon' onClick={() => handleRemoveImage(index)} />
                  </div>
                )
              })}
            </div>
          )}

          <div className='image_preview suggestions_previews' style={{ display: showSuggestions ? 'block' : 'none' }}>
              <ul>
                {
                  messagesList.map((message) => (
                    <li key={message._id} onClick={() => handleSuggestionClick(message.message)}> {message.message}</li>
                  ))
                }
              </ul>
          </div>

          <div className="mwb_block">
            {room?.roomkey && room?.roomstatus !== 'closed' && <InputGroup>

              {(loguser?.user_type==='teenager' || loguser?.user_type==='manager' || loguser?.user_type==='subuser') && <Button className="player_icon" data-pr-tooltip="Message Templates" data-pr-position="top"  onClick={() => setShowSuggestions((prev) => !prev)}>
                <img src={Question} alt="suggestion" />
                <img src={QuestionColor} alt="suggestion" />
              </Button>}
              <Tooltip target=".player_icon" />

              <Form.Control
                as="textarea"
                rows={1}
                placeholder='Your message...'
                value={message}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setDisabled((e.target.value.trim()?false:true));
                }}
                ref={inputRef}
              />
              {!disabled && message &&
              <Button variant="outline-secondary" className="pencil" data-pr-tooltip="AI Suggestion" data-pr-position="top" onClick={getSuggestion} >
                <img src={PencilAi} alt="Send" />
              <Tooltip target=".pencil" />

              </Button>}

              <Button variant="outline-secondary" onClick={handleSend} disabled={disabled}>
                <img src={Send} alt="Send" />
              </Button>
            </InputGroup>}

            {room?.roomkey && room?.roomstatus !== 'closed' &&
            <div className='chat_type_button' style={{ display: (showSuggestions || message !== "") ? 'none' : 'flex' }}>
              <Tooltip target=".player_icon" />
                <div className='player_icon audio_recording d-sm-block d-none' data-pr-tooltip="Audio Recording" data-pr-position="top"
                  onClick={() => { openRecorder('audio') }}
                >
                  <img src={Voice} alt="" /> <img src={VoiceColor} alt="" />
                </div>
                <div
                  className='player_icon video_recording d-sm-block d-none' data-pr-tooltip="Video Recording" data-pr-position="top"
                  onClick={() => { openRecorder('video') }}
                >
                  <img src={Video} alt="" /> <img src={VideoColor} alt="" />
                </div>
                <div className='player_icon attachicon d-sm-block d-none' data-pr-tooltip="Upload File" data-pr-position="top">
                  <input type="file" multiple onChange={handleFileChange} ref={inputFileRef} />
                  <img src={Attach} alt="" /> <img src={AttachColor} alt="" />
                </div>
                <div className=''>
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-button-drop-up-centered" className="player_icon">
                        <img src={More} alt="" /> <img src={MoreColor} alt="" />
                      </Dropdown.Toggle>


                      <Dropdown.Menu>
                        <Dropdown.Item href="" onClick={() => {  setShow(true) }}>
                          <img src={Scheduled} alt="" /> Schedule Reminder
                        </Dropdown.Item>
                        {loguser?.user_type === 'teenager' && (
                          <Dropdown.Item onClick={sendProfileCard}>
                            <img src={ProfileCard} alt="" /> Send Digital Profile Card
                          </Dropdown.Item>
                        )}

                        <Dropdown.Item href="" className="d-sm-none d-block" onClick={() => { openRecorder('audio') }}>
                          <img src={VoiceBlock} alt="" /> Audio Recording
                        </Dropdown.Item>

                        <Dropdown.Item href="" className="d-sm-none d-block" onClick={() => { openRecorder('video') }}>
                          <img src={VideoBlock} alt="" /> Video Recording
                        </Dropdown.Item>

                        <Dropdown.Item href="" className="attachicon d-sm-none d-block" onClick={() => inputFileRef.current.click()}>
                          <img src={AttachBlock} alt="" /> Upload File
                        </Dropdown.Item>

                      </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>}
          </div>

          {room?.roomstatus && room?.roomstatus === 'closed' && <div className="text-center" style={{color:"red"}}>This chat is inactive or the user account has been deleted.</div>}

          <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} >
            <Modal.Header closeButton>
              <Modal.Title>Schedule Reminder</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <FloatingLabel controlId="ScheduledTime" label={<span>Message <span className='required'>*</span> </span>} className="mb-3">
                  <Form.Control as="textarea"  name="message" onChange={handleChange} rows={3} value={formData.message||''} />
                  {errors.message && <small className='error' style={{color:"red"}}>{errors.message}</small>}
                </FloatingLabel>

                <FloatLabel className="mb3">
                  <Calendar
                    name="date"
                    value={formData.date||''}
                    onChange={handleChange}
                    placeholder=""
                    minDate={new Date()}
                    showTime
                    hourFormat="12"
                  />
                  <label htmlFor="date">Date/Time <span className='required'>*</span></label>
                </FloatLabel>
                {errors.date && <div className="error-message text-danger">{errors.date}</div>}

                <div className='btn_block'>
                  <button type="button" className='btn submit_btn me-1' onClick={setReminder}> Schedule </button>
                  <button type="button" className='btn submit_btn ms-1 back-button' onClick={handleClose}> Close </button>
                </div>

            </Modal.Body>
          </Modal>

          <Modal show={suggestionModel} onHide={handleClose} backdrop="static" keyboard={false} >
            <Modal.Header closeButton>
              <Modal.Title>Suggestion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!letterLoading &&
                  <div className='mb-3 mt-3 text-center'>
                    <ProgressSpinner />
                    <h5>Generating...</h5>
                  </div>
                }
                {letterLoading && <div className="squestions_row">
                    <div style={{whiteSpace: 'break-spaces'}}>{generateSuggest}</div>
                    <div className="sqr_bottom">
                        <button  type="button" className="btn apply_btn common_btn" onClick={() => {setMessage(generateSuggest); handleClose()}}> Insert </button>
                        <button type="button" className="Retry_btn" onClick={getSuggestion}> Retry </button>
                        <button type="button" className="btn copy_icon" onClick={copyToClipboard}> <img src={Copy} alt="" /> </button>
                    </div>
                  </div> }
            </Modal.Body>
          </Modal>

        </>

      )}
    </div>
  );

};

export default MessageInput;
