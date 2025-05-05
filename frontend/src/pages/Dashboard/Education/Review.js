import React,{useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import uEditAlt from '../../../assets/images/u_edit-alt.svg';
import { useNavigate } from 'react-router-dom';

function Review({handleSubmit, setStep, education}) {

    const { goToStep } = useWizard();
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


    const handleEducation = (type) => {
        // Clear the array each time the function is called
        let educationArray = [];
        // Assign resume.education value to educationArray
        educationArray = [...resume.education];
        // Push the new education entry to the array
        educationArray.push(education);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            education_complete_status:true,
            education:educationArray
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

                if(type === 'exit'){
                    handleSubmit();
                }else{
                   window.location.reload();
                }
            }
        })
        .catch((error) => console.error(error));
    }


    //window.formatDate
    return(
        <>
            <div className=''>

                <div className='review_data pb-0'>

                    {education.map((edu, index)=>(
                        <div className='review_box' key={index}>
                            <div className='review_content'>
                                <p className='que'> {edu.label} </p>
                                <p className='ans'> {(edu.question_tag==="graduation_start_year" || edu.question_tag==="graduation_end_year")?window.formatDate(edu.answer):edu.answer} </p>
                            </div>
                            <button className='edit_btn' type='button' onClick={()=>{
                                goToStep(index)
                                setStep(index+1)
                            }}> <img src={uEditAlt} alt="" /> </button>
                        </div>
                    ))}
                </div>

                <div className='btn_block'>
                    <button type="submit" className='btn submit_btn mb-2 me-1' onClick={()=> handleEducation('more')}>Save and add more</button>
                    <button type="submit" className='btn submit_btn mb-2' onClick={() => handleEducation('exit')}>Save and exit</button>
                </div>
            </div>
        </>
    )
}

export default Review;