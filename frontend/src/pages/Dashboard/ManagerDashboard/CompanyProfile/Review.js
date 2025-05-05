import React,{useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import uEditAlt from '../../../../assets/images/u_edit-alt.svg';
import user from '../../../../assets/images/user.jpg';
import camera from '../../../../assets/images/camera.svg';
import deleteicon from '../../../../assets/images/delete.svg';

function Review({GoBackStep, setStep, handleSubmit, formData}) {

    const [logo, setLogo] = useState(user);
    const { goToStep, previousStep } = useWizard();
    const TOKEN = localStorage.getItem('token');

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleCompany = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const newdata = new FormData();

        for(let key in formData){
            if(key === 'company_logo' && formData[key] && typeof formData[key] === 'object'){
                newdata.append(key, formData[key], 'company_logo_cropped_image.png');
            }else{
                newdata.append(key, formData[key]);
            }

        }


        if(typeof formData.company_logo === 'string') {
            newdata.delete('company_logo');
        }

        newdata.append('company_completed', true);


        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: newdata,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-company`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                localStorage.setItem('userData',JSON.stringify(result.data));
                handleSubmit();
            }else{
                window.showToast(result.message,'error');
            }
        })
        .catch((error) => console.error(error));

    }

    // update-company
    useEffect(()=>{
        if(typeof formData.company_logo === 'string') {
            setLogo(formData.company_logo);
        }else{
            if(typeof formData.company_logo === 'object') {
                const reader = new FileReader();
                reader.onload = () => {
                    setLogo(reader.result);
                };
                reader.readAsDataURL(formData.company_logo);
            }

        }
    },[formData.company_logo])

    return(
        <>
            <div className=''>
                <div className='review_data'>

                    <div className='image_update_block'>
                        <div className='change_user_img'>
                            <img src={logo} alt="User" />
                        </div>
                    </div>

                    <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> Company Purpose </p>
                            <p className='ans'> {formData.company_purpose} </p>
                        </div>
                        <button className='edit_btn' type='button' onClick={()=>{
                            goToStep(1)
                            setStep(2)
                        }}> <img src={uEditAlt} alt="" /> </button>
                    </div>
                    <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> Company Culture </p>
                            <p className='ans'> {formData.company_culture}  </p>
                        </div>
                        <button className='edit_btn' type='button' onClick={()=>{
                            goToStep(2)
                            setStep(3)
                        }}> <img src={uEditAlt} alt="" /> </button>
                    </div>
                    <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> Company Values </p>
                            <p className='ans'> {formData.company_values} </p>
                        </div>
                        <button className='edit_btn' type='button' onClick={()=>{
                            goToStep(3)
                            setStep(4)
                        }}> <img src={uEditAlt} alt="" /> </button>
                    </div>
                    <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> Life at Your Company </p>
                            <p className='ans'> {formData.company_life}</p>
                        </div>
                        <button className='edit_btn' type='button' onClick={()=>{
                            goToStep(4)
                            setStep(5)
                        }}> <img src={uEditAlt} alt="" /> </button>
                    </div>

                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}>Back</button>
                    <button type="button" className='btn submit_btn' onClick={handleCompany}>Save and Continue</button>
                </div>
            </div>
        </>
    )
}

export default Review;