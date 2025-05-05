import React, { useState, useEffect } from 'react';
import { Container, Modal } from 'react-bootstrap';
import QuestionOne from './QuestionOne';
import Review from './Review';
import { useNavigate } from 'react-router-dom';
import { Wizard } from 'react-use-wizard';
import LightBulb from '../../../assets/images/LightBulb.svg';
import { useProfile } from '../../../ProfileContext';

function Hobbies() {

    const geturl = new URL(window.location.href).searchParams;
    const EditUrl = geturl.get('edit');

    const {theme} = useProfile();

    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [checked, setChecked] = useState([]);
    const TOKEN = localStorage.getItem('token');
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (event) => {
        if(checked.length > 0){
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Hobbies and Interests');
        }
        navigate(EditUrl||'/dashboard');
    };

    const goDashboardPage = () => {
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
                if(result.data.hobbies_status){
                    const list =  result.data.hobbies;

                    const data = list.flatMap(({ answer }) =>
                        answer.flatMap(({ title, hobbies }) => {
                            let cat = title;
                            return hobbies.map(({ id, title }) => ({
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
                    {/* <Modal.Title>Hobbies and Interests</Modal.Title> */}
                    <div className='icons'>
                            <img src={LightBulb} alt="" />
                        </div>
                </Modal.Header>
                <Modal.Body>
                <div className='modal_content'>
                    <div className="make_resume_content_block">
                        <div className="make_resume_content">
                            <h2 className="mrc_heading"> Welcome to the Hobbies and Interests Section </h2>
                            <p className="src_desc"> Your hobbies and interests can tell employers a lot about who you are outside of work. They offer a glimpse into your personality, passions, and what makes you unique. </p>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> How It Works </h2>
                            <ul className="">
                                <li> List any hobbies or interests that reflect your personality, whether it’s sports, music, reading, gaming, or anything you enjoy. Be open and honest, as your interests are what make you unique. </li>
                                <li> Including these details shows that you're well-rounded and can help spark conversations during interviews. </li>
                                <li> Don’t underestimate the value of your interests—these can make you a memorable candidate! </li>
                            </ul>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> Why It Matters </h2>
                            <p className="src_desc"> Employers want to get to know the real you, and sharing your hobbies can help them see how you might fit into their team or company culture. Plus, these personal interests can highlight traits like creativity, teamwork, or dedication that translate into the workplace. </p>
                        </div>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Hobbies;
