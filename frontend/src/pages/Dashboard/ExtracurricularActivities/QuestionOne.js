import React,{useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";

function QuestionOne({ GoNextStep, goDashboardPage, checked, setChecked }) {
    const [activities, setActivities] = useState([]);
    const [selected, setSelected] = useState(checked);
    const [errors, setErrors] = useState('');
    const { nextStep } = useWizard();
    const TOKEN = localStorage.getItem('token');

    useEffect(()=>{

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-activities`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status =='S'){
                setActivities(result.data);
            }
        })
        .catch((error) => console.error(error));

    },[])

    const closeInfomastion = () => {
        goDashboardPage();
    }

    const handleClickNext = () => {
        if(selected.length <= 0){
            //setErrors('Please select at least one activity.');
            window.showToast("Please select at least one activity.",'error');
        }else{
            setErrors('');
            GoNextStep();
            nextStep();
        }
    }

    const handleChange = (e,value) => {
        let updatedSelected;
        if(e.target.checked){
            if(selected.length >= 10){
                e.target.checked = false;
                window.showToast("You can't select more than 10 activities.",'error');
                return
            }
            updatedSelected = [...selected, value];
        }else{
            updatedSelected = selected.filter(item => item.id !== value.id);
        }

        setChecked(updatedSelected);
        setSelected(updatedSelected);
    }

    return (
        <>
            <div>
                <div className="rim_content">
                    <h1 className="rim_heading">Which of the following extracurricular activities have you participated in? </h1>
                    <p className='rim_text mb-0'> Please select up to 10 activities </p>
                </div>

                <div className='hobbies_select_block'>
                    {activities.map((activitie,index) => (
                        <div key={index} className='hobbies_type_block'>
                            <h3 className="hobbies_title"> {activitie.title} </h3>
                            {activitie.activities.map(({ id, title, image },i) => (
                                <label key={i} className="checkbox">
                                    <input type="checkbox" checked={selected.some(item => item.id === id)}  onChange={(e)=>{handleChange(e,{
                                        cat: activitie.title,
                                        id: id,
                                        title: title
                                    })}} />
                                    <span className="checkmark">
                                        {image && <img src={image} alt={title} />} {title}
                                    </span>
                                </label>
                            ))}
                        </div>
                    ))}

                    {errors && <small style={{color:'red'}}>{errors}</small>}
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={closeInfomastion}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default QuestionOne;
