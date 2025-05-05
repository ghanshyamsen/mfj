import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import './index.css'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchIcon from '../../assets/images/search.svg';
import Lamp from '../../assets/images/Lamp.png';
import logoimg from '../../assets/images/no_image_logo.jpg';
import { Link } from 'react-router-dom';

import { useProfile } from '../../ProfileContext';

const MyApplication = () => {

  const {theme} = useProfile();
  const TOKEN = localStorage.getItem('token');
  const User = JSON.parse(localStorage.getItem('userData'));
  const Url = new URL(window.location.href).searchParams;
  const status = Url.get('st');

  const [applications, setApplications] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);

  const [reqId, setReqId] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = (id) => {
    setReqId(id);
    setShowModal(true);
  };

  const handleOpenCoverModal = (letter) => {
    setCoverLetter(letter);
    setShowCoverModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setShowCoverModal(false);
  };

  useEffect(() => {
    fetchApplications();
  },[]);

  const fetchApplications = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?user=${User._id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      setApplications(result.data);
    })
    .catch((error) => console.error(error.message));
  }

  const CancelApplication = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/delete-applied-job/${reqId}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        window.showToast(result.message,"success");
        fetchApplications();
        handleCloseModal();
      }
    })
    .catch((error) => console.error(error));
  }

  const filteredApplications = applications.filter(application =>
    application.job_info.job_position.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    application.job_info.orgnaization.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    application.job_info.location.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );



  return (
    <>
      <div className="my_application_page common_background_block">
        <div className="dashboard_content_block">
          <div className='recent_block'>
              <div className='search_block'>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="keywords">
                    <img src={SearchIcon} alt="" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Title, keywords, location"
                    aria-label="keywords"
                    aria-describedby="keywords"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </div>
              {/*  */}
              <div className='application_ul_list'>
                  <ul>
                      {filteredApplications.map((application, index) => (
                        ((status === 'hired' && application.status==='Invited') || (!status)) && <li key={index}>
                            <div className='aul_content'>
                                <div className={`status_text ${application.status.toLowerCase()} ms-0 mb-2`}>{application.status==='Invited'?'Hired':(application.status ==='Pending'?'In Review':'Not Hired')}</div>
                                <h4 className='application_name'> <Link to={`/job-detail/${application.job_id}`}> {application.job_info.job_position} </Link> </h4>
                                <p className='amount'>{application.job_info.salary}</p>
                                <p className='aul_text aul_keyword'>{application.job_info.orgnaization}</p>
                                <p className='aul_text aul_location'>{application.job_info.location}</p>
                                <div className='aul_button_block'>
                                  <button className='btn cancel_btn' onClick={()=>{handleOpenModal(application._id)}}>Cancel application</button>
                                  {application.cover_letter && <button className='btn cancel_btn cover_btn ms-2' onClick={()=>{handleOpenCoverModal(application.cover_letter)}}> Cover letter </button>}
                                </div>
                            </div>
                            <div className='icon'>
                              <img src= {application.job_info.logo==="" ? logoimg : application.job_info.logo } alt="" />
                            </div>
                        </li>
                      ))}
                  </ul>
              </div>
          </div>
        </div>
      </div>

      {/* Modal block */}

      <Modal className={`application_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <div className='icons'>
            <img src={Lamp} alt="" />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='application_modal_content'>
            <h1 className='heading'>Cancelling application</h1>
            <p className='text'>Are you sure you want to cancel application?</p>
            <button className='btn cancel_btn' type='button'  onClick={CancelApplication} >Cancel</button>
            <button className='btn goback_btn' type='button' onClick={handleCloseModal}>Go back</button>
          </div>
        </Modal.Body>
      </Modal>
      {/*  */}
      <Modal className={`application_modals cover_letter_modals ${theme}`} show={showCoverModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <h3 className='modal_title'> Cover letter </h3>
        </Modal.Header>
        <Modal.Body>
          <div className='cover_letter_content'>
            {coverLetter}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MyApplication;
