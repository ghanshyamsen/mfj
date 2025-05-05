import React,{useState, useEffect} from 'react';
import uEditAlt from '../../../assets/images/u_edit-alt.svg';
import { useWizard } from "react-use-wizard";
import { useNavigate } from 'react-router-dom';

function Review({handleSubmit, setStep, award}) {

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


    const handleAward = (type) => {
        // Clear the array each time the function is called
        let awardArray = [];
        // Assign resume.education value to educationArray
        awardArray = [...resume.awards_achievments];
        // Push the new education entry to the array
        awardArray.push(award);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            awards_achievments_status:true,
            awards_achievments:awardArray
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
                    history('/awards-and-achievements');
                }

            }
        })
        .catch((error) => console.error(error));
    }


    return(
        <>
            <div className=''>

                <div className='review_data pb-0'>
                    {
                        award.map((value, index) => (
                            <div className='review_box' key={index}>
                                <div className='review_content'>
                                    <p className='que'> {value.label} </p>
                                    <p className='ans'> {value.question_tag ==="date_received"?window.formatDate(value.answer):value.answer} </p>
                                </div>
                                <button className='edit_btn' type='button' onClick={()=>{
                                    goToStep(index)
                                    setStep(index+1)
                                }}> <img src={uEditAlt} alt="" /> </button>
                            </div>
                        ))
                    }
                    <div className='btn_block'>
                        <button type="submit" className='btn submit_btn mb-2 me-1' onClick={()=> handleAward('more')}>Save and add more</button>
                        <button type="submit" className='btn submit_btn mb-2' onClick={()=> handleAward('exit')}>Save and exit</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Review;