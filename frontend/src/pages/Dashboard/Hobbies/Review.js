import React from 'react';
import uEditAlt from '../../../assets/images/u_edit-alt.svg';
import { useWizard } from "react-use-wizard";

function Review({GoBackStep, handleSubmit, checked}) {

    const { nextStep, previousStep } = useWizard();
    const TOKEN = localStorage.getItem('token');

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleHobbies = () => {

        const groupedData = checked.reduce((acc, item) => {
            const { cat, id, title } = item;
            let group = acc.find(g => g.title === cat);
            if (!group) {
                group = { title: cat, hobbies: [] };
                acc.push(group);
            }
            group.hobbies.push({ id, title });
            return acc;
        }, []);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            hobbies: {
                question:"Which of the following hobbies and interests do you enjoy in your free time?",
                answer: groupedData
            },
            hobbies_status:true
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
                handleSubmit();
            }else{
                window.showToast(result.message, "error");
            }
        })
        .catch((error) => console.error(error));
    }

    return(
        <>
            <div className=''>

                <div className='review_box'>
                    <div className='review_content'>
                        <p className='que'> Which of the following hobbies and interests do you enjoy in your free time? </p>
                        <ul className=''>
                            {
                                checked.map((value, i) =>(
                                    <li key={i}> {value.title} </li>
                                ))
                            }
                        </ul>
                    </div>
                    <button className='edit_btn' type='button' onClick={handleClickBack}> <img src={uEditAlt} alt="" /> </button>
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}>Back</button>
                    <button type="button" className='btn submit_btn' onClick={handleHobbies}>Save and Continue</button>
                </div>
            </div>
        </>
    )
}

export default Review;