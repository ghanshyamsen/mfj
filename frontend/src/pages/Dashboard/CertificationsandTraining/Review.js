import React,{useState, useEffect} from 'react';
import uEditAlt from '../../../assets/images/u_edit-alt.svg';
import { useWizard } from "react-use-wizard";
import { useNavigate } from 'react-router-dom';

function Review({GoBackStep, handleSubmit, certificate, setStep}) {
    const { previousStep, goToStep } = useWizard();
    const [resume, setResume] = useState({});
    const TOKEN = localStorage.getItem('token');

    const history = useNavigate();

    useEffect(()=>{

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+TOKEN);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        /** -----  */
        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'S'){
                setResume(result.data);
            }
        })
        .catch((error) => console.error(error.message));

    },[])

    const handleCertification = (type) => {

        // Clear the array each time the function is called
        let certificationArray = [];
        // Assign resume.education value to educationArray
        certificationArray = [...resume.certification];
        // Push the new education entry to the array
        certificationArray.push(certificate);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            certification_status:true,
            certification:certificationArray
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
                if(type ==='exit'){
                    handleSubmit();
                }else{
                    history('/certification-and-training');
                }

            }
        })
        .catch((error) => console.error(error));

    }

    /* const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }
 */

    return(
        <>
            <div className=''>

                <div className='review_data pb-0'>
                    {
                        certificate.map((value, index) => (
                            <div className='review_box' key={index}>
                                <div className='review_content'>
                                    <p className='que'> {value.label} </p>
                                    <p className='ans'> {(value.question_tag==="issue_date" || value.question_tag==="expiry_date") && value.answer?window.formatDate(value.answer):value.answer} </p>
                                </div>
                                <button className='edit_btn' type='button' onClick={() => {
                                    goToStep(index);
                                    setStep(index+1);
                                }}> <img src={uEditAlt} alt="" /> </button>
                            </div>
                        ))
                    }
                </div>

                <div className='btn_block'>
                    {/* <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button> */}
                    <button type="submit" className='btn submit_btn mb-2 me-1' onClick={()=> handleCertification('more')}>Save and add more</button>
                    <button type="submit" className='btn submit_btn mb-2' onClick={()=> handleCertification('exit')}>Save and exit</button>
                </div>

            </div>
        </>
    )
}

export default Review;