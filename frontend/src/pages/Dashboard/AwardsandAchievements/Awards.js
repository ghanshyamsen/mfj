import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import QuestionOne from './QuestionOne';
import QuestionTwo from './QuestionTwo';
import QuestionThree from './QuestionThree';
import QuestionFour from './QuestionFour';
import Review from './Review';

import Dots from '../../../assets/images/dots.svg';
import Plus from '../../../assets/images/plus.svg';
import Dropdown from 'react-bootstrap/Dropdown';

import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';
import { Modal } from 'react-bootstrap';
import { useProfile } from '../../../ProfileContext';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Calendar } from 'primereact/calendar';
import CheckMark from '../../../assets/images/award_start.png';
import { FloatLabel } from 'primereact/floatlabel';
import SweetAlert from 'react-bootstrap-sweetalert';

function Awards() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const {theme} = useProfile();
    const TOKEN = localStorage.getItem('token');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showListing, setSetListing] = useState(true);
    const [awardList, setAwardList] = useState([]);
    const [award, setAward] = useState([]);
    const [editaward, setEditAward] = useState([]);
    const [editIndex, setEditIndex] = useState('');
    const [ismove, setIsMove] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);

      const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if(result.status ==='S'){
                if(result.data.awards_achievments_status){
                    setAwardList(result.data.awards_achievments);
                    setSetListing(true);
                }else{
                   setSetListing(false);
                }
            }
            setLoading(true);
          })
          .catch((error) => console.error(error));
    },[])

    useEffect(() => {
        if(ismove){
            updateResume()
        }
    },[awardList]);

    // Function to update or add an object at a specific index
    const updateOrAddObjectAtIndex = (index, newObject) => {
        setAward((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;
            return newArray;
        });
    };

    const updateOrdering = (index, newObject) => {
        setAwardList((prevArray) => {
            // Create a copy of the current state
            const newArray = [...prevArray];
            // Update the object at the specific index or add it if the index does not exist
            newArray[index] = newObject;

            return newArray;
        });
    };

    const moveHigher = (key) =>{

        let currentKey = key;
        let upperKey = (key-1);
        let currentArray = awardList[key];
        let upperArray = awardList[(key-1)];

        updateOrdering(upperKey,currentArray);
        updateOrdering(currentKey,upperArray);
        setIsMove(true);
    }

    const updateResume = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            awards_achievments:awardList
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status=='S'){
                if(!ismove){
                    //goDashboardPage();
                }
            }
        })
        .catch((error) => console.error(error.message));
    }

    const handleSubmit = (event) => {
        if(award.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Awards and Achievements');
        }
        navigate(EditUrl||'/dashboard');
    };

    const goDashboardPage = () => {
        if(awardList.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Awards and Achievements');
        }
        navigate(EditUrl||'/dashboard');
    };

    const handleAwards = () => {
        setSetListing(false);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleChange = (e) => {
        setEditAward(editaward.map(award => {
            if (award.question_tag === e.target.name) {
                return {
                    ...award,
                    answer: e.target.value,
                    [award.question_tag]: e.target.value
                };
            }
            return award;
        }))
    }

    const editAwardsModal = (index,value) => {
        setEditIndex(index);
        setEditAward(value);
        setShowModal(true);
    }

    const showPicker = (e) => {
        if(e.target.name === "date_received"){
            // Your logic for showing the date picker
            return e.target.showPicker();
        }
    };

    const validation = (data) => {
        const errors = {};

        data.map((value, key) => {
            if(!value.answer){
                switch (value.question_tag) {
                    case "certification_name":
                        errors.certification_name = "Title is required.";
                    break;

                    case "awarding_organization":
                        errors.awarding_organization = "Organization or issuer is required.";
                    break;

                    case "date_received":
                        errors.date_received = "Issue date is required.";
                    break;
                }
            }
        });

        return errors;
    }

    const saveAward = () => {

        const validated = validation(editaward);

        if(Object.keys(validated).length > 0){
            setErrors(validated);
            return
        }
        setErrors({});

        setAwardList(prevList => {
            const newAwardList = [...prevList];
            newAwardList[editIndex] = editaward;
            return newAwardList;
        });

        setIsMove(true);
        handleCloseModal();
    }

    const deleteAward = (Index=false) => {

        setAwardList(prevList => {
            const newAwardList = [...prevList];
            newAwardList.splice((Index||editIndex), 1);
            return newAwardList;
        });

        setIsMove(true);
        handleCloseModal();
        setShowAlert(false);
    }


    return (
        <>
            <SweetAlert
                show={showAlert}
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={deleteAward}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                The record will get deleted.
            </SweetAlert>

            <div className="objectives-and-summary-page resume_infomation_moduals">
                <Container>

                    {loading && showListing && <div className='dcb_block'>
                        <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>

                        <div className='heading_row'>
                            <h1 className='rim_heading'> Awards and Achievements </h1>
                        </div>
                        <div className='add_more_content_block'>
                            <button className='add_education' onClick={handleAwards}> <img src={Plus} alt=""  /> <span> Add award or achievement </span> </button>
                            {
                                awardList.map((award, index) => (
                                    <div className='education_info' key={index}>

                                        <div className='info_title'>
                                            <h2 className=''> {award[0].answer} </h2>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="success" className="uf_dropdowns" id="dropdown-basic">
                                                    <img src={Dots} alt="" />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    {index > 0 && <Dropdown.Item onClick={() => { moveHigher(index) }}> Move higher </Dropdown.Item>}
                                                    <Dropdown.Item onClick={()=>{editAwardsModal(index,award)}}> Edit </Dropdown.Item>
                                                    <Dropdown.Item onClick={()=>{
                                                        setEditIndex(index)
                                                        setShowAlert(true)
                                                    }}> Delete </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>


                                        <p className='it-text'> {award[1].answer} • {window.formatDate(award[2].answer)} </p>
                                        <p className='id-text'> {award[3].answer} </p>
                                    </div>
                                ))
                            }
                        </div>

                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn mb-2' onClick={goDashboardPage}>Save and exit</button>
                        </div>
                    </div>}


                    {/*  */}
                    {loading && !showListing && <div className='dcb_block '>
                        <div className='heading_row'>
                            {currentStep === 5 ? (
                                <h1 className='rim_heading'>Review {/* Awards and Achievements */} </h1>
                            ) : (
                                <span className='mcount'>{currentStep}/4</span>
                            )}
                            <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <Wizard>
                                <QuestionOne
                                    GoNextStep={() => setCurrentStep(2)}
                                    goDashboardPage={goDashboardPage}
                                    award={award[0]}
                                    setAward={updateOrAddObjectAtIndex}
                                />
                                <QuestionTwo
                                    GoBackStep={() => setCurrentStep(1)}
                                    GoNextStep={() => setCurrentStep(3)}
                                    award={award[1]}
                                    setAward={updateOrAddObjectAtIndex}
                                />
                                <QuestionThree
                                    GoBackStep={() => setCurrentStep(2)}
                                    GoNextStep={() => setCurrentStep(4)}
                                    award={award[2]}
                                    setAward={updateOrAddObjectAtIndex}
                                />
                                <QuestionFour
                                    GoBackStep={() => setCurrentStep(3)}
                                    GoNextStep={() => setCurrentStep(5)}
                                    award={award[3]}
                                    setAward={updateOrAddObjectAtIndex}
                                />
                                <Review
                                    handleSubmit={handleSubmit}
                                    setStep={(key) => setCurrentStep(key)}
                                    award={award}
                                />
                            </Wizard>
                        </form>
                    </div>}

                </Container>
            </div>

            {/* modal */}
            <Modal className={`edit_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <h1 className='heading'> Edit awards and achievements </h1>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        <form>
                            <div className='field_form'>
                                {
                                    editaward.map((award,index) =>
                                    {
                                        const error = errors[award.question_tag];

                                        return (
                                            index == 3?
                                            <FloatingLabel key={index} controlId={award.label} label={award.label} className="mb-3">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    name={award.question_tag}
                                                    value={award.answer}
                                                    onChange={handleChange}
                                                    placeholder=""
                                                    maxLength="300"
                                                />
                                                <div className="d-flex">
                                                    <p className="phone_Text"> {award.answer.length}/300 </p>
                                                    <p className="phone_Text"> Optional </p>
                                                </div>
                                            </FloatingLabel>:
                                            <>
                                                {award.question_tag!=="date_received" &&
                                                    <FloatingLabel key={index} controlId={award.label} label={(award.question_tag!=="date_received"?<>{award.label} <span className="required">*</span></>:'')} className="mb-3">
                                                        <Form.Control
                                                            type="text"
                                                            name={award.question_tag}
                                                            value={award.answer}
                                                            onChange={handleChange}
                                                            onClick={showPicker}
                                                            placeholder=""
                                                        />
                                                    </FloatingLabel>
                                                }
                                                {award.question_tag==="date_received" &&
                                                <FloatLabel className="mb-3">
                                                    <Calendar
                                                        name={award.question_tag}
                                                        value={award.answer?new Date(window.parseDateString(award.answer)):''}
                                                        onChange={handleChange}
                                                        placeholder=''
                                                        dateFormat="mm/yy"
                                                        maxDate={new Date()}
                                                        view="month"
                                                    />
                                                    <label htmlFor="date_of_birth">Issue Date <span className='required'>*</span></label>
                                                </FloatLabel>
                                                }
                                                {error && <div className="error-message" style={{ color: 'red'}}>{error}</div>}
                                            </>
                                        )
                                    }
                                )}
                            </div>

                            <div className='btn_block mt-5'>
                                <button type="button" className='btn submit_btn back-button' onClick={()=>{setShowAlert(true)}}> Delete </button>
                                <button type="button" className='btn submit_btn' onClick={saveAward}> Save </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    {/* <Modal.Title>Awards and Achievements</Modal.Title> */}
                    <div className='icons'>
                        <img src={CheckMark} alt="" />
                    </div>
                </Modal.Header>
                <Modal.Body>
                <div className='modal_content'>
                    <div className="make_resume_content_block">
                        <div className="make_resume_content">
                            <h2 className="mrc_heading"> Welcome to the Awards and Achievements Section </h2>
                            <p className="src_desc"> This section is all about showcasing the accomplishments that make you stand out. Whether it’s an award, an extraordinary achievement, or recognition for your hard work, this is your chance to highlight a part of your unique story. </p>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> How It Works </h2>
                            <ul className="">
                                <li> You can list any awards or achievements you've earned in school, sports, volunteering, or hobbies. </li>
                                <li> Sharing these accomplishments helps employers see your potential for success and what makes you different from other candidates. </li>
                                <li> If you don’t have any awards yet, that’s okay! This section is just one of many ways to show your strengths. </li>
                            </ul>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> Why It Matters </h2>
                            <p className="src_desc"> Listing your awards and achievements sets you apart. It demonstrates to employers that you are driven, talented, and committed. These achievements speak volumes about your work ethic and potential for growth in the workplace. </p>
                        </div>
                    </div>
                </div>
                </Modal.Body>
            </Modal>

        </>

    );
}

export default Awards;
