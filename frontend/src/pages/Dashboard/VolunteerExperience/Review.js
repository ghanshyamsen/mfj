import React,{useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import uEditAlt from '../../../assets/images/u_edit-alt.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import Dots from '../../../assets/images/dots.svg';
import Plus from '../../../assets/images/plus.svg';

function Review({GoBackStep, setStep, vexperience, handleSubmit}) {
    const { goToStep, previousStep } = useWizard();
    const [resume, setResume] = useState({});
    const TOKEN = localStorage.getItem('token');



    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

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

    const handleComplete = (type) => {

        // Clear the array each time the function is called
        let volunteerArray = [];
        // Assign resume.education value to educationArray
        volunteerArray = [...resume.volunteer_experience];
        // Push the new education entry to the array
        volunteerArray.push(vexperience);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            volunteer_experience:volunteerArray,
            volunteer_complete_status:true
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
            if(result.status === 'S'){

                if(type ==='exit'){
                    handleSubmit();
                }else{
                   window.location.reload();
                }

            }
        })
        .catch((error) => console.error(error.message));
    }


    return(
        <>
            <div className=''>
                <div className='review_data'>
                    {vexperience.map((value, index)=>(
                        <div className='rd_block' key={index}>
                            {index < 3 && <h2 className='tdb_title'> {value.title} </h2>}
                            {value.info.map((info,i) => (
                                <div className='review_box' key={index+'_'+i}>
                                    <div className='review_content'>
                                        <p className='que'>{info.question}</p>
                                        <p className='ans'>{ (info.question_tag === 'startdate' || info.question_tag === 'enddate') && info.answer?window.formatDate(info.answer):info.answer} </p>
                                    </div>
                                    <button className='edit_btn' type='button' onClick={()=>{
                                        goToStep(index)
                                        setStep((index+1))
                                    }}> <img src={uEditAlt} alt="" /> </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className='btn_block'>
                    {/* <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}>Back</button> */}
                    <button type="submit" className='btn submit_btn me-1' onClick={()=> handleComplete('more')}>Save and add more</button>
                    <button type="submit" className='btn submit_btn' onClick={()=> handleComplete('exit')}>Save and exit</button>
                </div>

            </div>
        </>
    )
}

export default Review;