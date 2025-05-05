import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import QuestionOne from './QuestionOne';
import Review from './Review';
import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';
import { Modal } from 'react-bootstrap';
import SportsMedal from '../../../assets/images/SportsMedal.svg';
import { useProfile } from '../../../ProfileContext';

function ExtraActivities() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const {theme} = useProfile();

    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [checked, setChecked] = useState([]);
    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const TOKEN = localStorage.getItem('token');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (event) => {

        if(checked.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Extracurricular Activities');
        }
        navigate(EditUrl||'/dashboard');

    };


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
            if(result.status == 'S'){
                if(result.data.activitie_complete_status){
                    const list =  result.data.extracurricular_activities;

                    const data = list.flatMap(({ answer }) =>
                        answer.flatMap(({ title, activities }) => {
                            let cat = title;
                            return activities.map(({ id, title }) => ({
                                cat: cat,
                                id: id,
                                title: title
                            }));
                        })
                    );

                    setChecked(data);
                    setIndex(1);
                    setCurrentStep(2);
                }

                setLoading(true);

            }else{
                window.showToast("Please complete your personal details first.","error");
                navigate(EditUrl||'/dashboard');
            }
        })
        .catch((error) => console.error(error.message));

    },[])

    const goDashboardPage = () => {
        navigate(EditUrl||'/dashboard');
    };

    return (
        <>
        <div className="hobbies_page resume_infomation_moduals">
            <Container>
                <div className='dcb_block'>
                    <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>
                    <div className='heading_row'>
                        {currentStep === 2 ? (
                            <h1 className='rim_heading'> Review </h1>
                        ) : (
                            <span className='mcount'>{currentStep}/1</span>
                        )}
                        <button type="button" className="btn-close" onClick={goDashboardPage}></button>
                    </div>
                    {loading && <form onSubmit={handleSubmit}>
                        <Wizard startIndex={index}>
                            <QuestionOne
                                GoNextStep={() => setCurrentStep(2)}
                                goDashboardPage={goDashboardPage}
                                checked={checked}
                                setChecked={setChecked}
                            />
                            <Review
                                GoBackStep={() => setCurrentStep(1)}
                                handleSubmit={handleSubmit}
                                checked={checked}
                            />
                        </Wizard>
                    </form>}
                </div>
            </Container>
        </div>

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    {/* <Modal.Title>Extracurricular Activities</Modal.Title> */}
                    <div className='icons'>
                            <img src={SportsMedal} alt="" />
                        </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_content'>
                        <div className="make_resume_content_block">
                            <div className="make_resume_content">
                                <h2 className="mrc_heading"> Welcome to the Extracurricular Activities Section </h2>
                                <p className="src_desc"> Extracurricular activities are a great way to show employers that you're well-rounded and capable of balancing multiple responsibilities. These activities also help demonstrate essential skills like leadership, teamwork, and time management. </p>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> How It Works </h2>
                                <ul className="">
                                    <li> You can list any extracurricular activities you’ve participated in, such as clubs, camps, or sports.  </li>
                                    <li> These activities help show employers that you’re proactive and dedicated to your personal growth. </li>
                                    <li> Even if you haven’t participated in formal activities, any ongoing commitment or project you’ve been a part of can count! </li>
                                </ul>
                            </div>
                            <div className="make_resume_content">
                                <h2 className="mrc_title"> Why It Matters </h2>
                                <p className="src_desc"> Extracurricular activities give you an edge by showing you’ve developed important skills beyond the classroom. Highlighting your involvement in these activities can help employers see that you’re committed, reliable, and able to handle responsibilities. </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ExtraActivities;
