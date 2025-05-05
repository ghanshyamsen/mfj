import React, { useState, useEffect } from 'react';
import { useWizard } from "react-use-wizard";
import uEditAlt from '../../../assets/images/u_edit-alt.svg';

function Review({ GoBackStep, GoNextStep, objective, handleSubmit, setMoveLast }) {
    const { goToStep, previousStep } = useWizard();

    const [objAns, setObjAns] = useState({});
    const [objSummary, setObjSummary] = useState('');

    const TOKEN = localStorage.getItem('token');

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }



    const handleObjectivesSummary = () => {
        // Function implementation


        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+TOKEN);

        const raw = JSON.stringify({
            objective_complete_status: true,
            objective_summary: objSummary
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
            if(result.status == 'S'){
                handleSubmit()
            }
        })
        .catch((error) => console.error(error.message));
    }

    useEffect(() => {

        setMoveLast(false);

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + TOKEN);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'S') {

                    let question_one_ans = result.data.question_one_ans;
                    let question_two_ans = result.data.question_two_ans;
                    let question_three_ans = result.data.question_three_ans;
                    let question_four_ans = result.data.question_four_ans;
                    let question_five_ans = result.data.question_five_ans;

                    setObjAns({
                        0:question_one_ans,
                        1:question_two_ans,
                        2:question_three_ans,
                        3:question_four_ans,
                        4:question_five_ans
                    });

                    setObjSummary(result.data.objective_summary);
                }
            })
            .catch((error) => console.error(error.message));
    }, []);

    return (
        <>
            <div className=''>
                <div className='review_data'>
                    {
                        objective.map((obj, index) => (
                            <div className='review_box' key={obj.s_no}>
                                <div className='review_content'>
                                    <p className='que'> {obj.question} </p>
                                    <p className='ans'> {objective[index][`option_${objAns[index]}`]} </p>
                                </div>
                                <button className='edit_btn' type='button' onClick={()=>{
                                    goToStep(index)
                                    GoNextStep(obj.s_no)
                                }}> <img src={uEditAlt} /> </button>
                            </div>
                        ))
                    }
                    <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> Share your personal summary </p>
                            <p className='ans'> {objSummary}  </p>
                        </div>
                        <button className='edit_btn' type='button' onClick={()=>{
                            goToStep(5)
                            GoNextStep(6)
                        }}> <img src={uEditAlt} /> </button>
                    </div>
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button mt-0' onClick={handleClickBack}>Back</button>
                    <button type="button" className='btn submit_btn  mt-0' onClick={handleObjectivesSummary}>Save and Continue</button>
                </div>
            </div>
        </>
    )
}

export default Review;
