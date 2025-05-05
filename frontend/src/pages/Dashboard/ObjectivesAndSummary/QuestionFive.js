import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";

function QuestionFive({GoBackStep, GoNextStep, data, onUpdate, objective, resume, fetchResume,setMoveLast}) {
    const [selectedOption, setSelectedOption] = useState("");
    const [error, setError] = useState(false);
    const { nextStep, previousStep } = useWizard();

    const TOKEN = localStorage.getItem('token');

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!selectedOption){
            setError("Please select an option.");
            return
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+TOKEN);

        const raw = JSON.stringify({
            question_five_ans: selectedOption,
            generate_summary: true
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
                setMoveLast(true);
                GoNextStep();
                nextStep();
            }else{
                window.showToast(result.message, "error");
            }
        })
        .catch((error) => console.error(error.message));
    }

    const options = [
        { id: 'one', label: objective[4].option_one },
        { id: 'two', label: objective[4].option_two },
        { id: 'three', label: objective[4].option_three },
        { id: 'four', label: objective[4].option_four }
    ];

    const handleOptionChange = (option) => {
        setError(false);
        setSelectedOption(option);
    }

    useEffect(() => {
        fetchResume();
    },[])

    useEffect(()=>{
        setSelectedOption(resume.question_five_ans);
    },[resume]);

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">{objective[4].question}</h1>
                </div>
                <div className="custom-radio-buttons">
                    <div className="crb_inside">
                        {options.map(option => (
                            <label key={option.id} className={`radio-button ${selectedOption === option.id ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    value={option.id}
                                    checked={selectedOption == option.id}
                                    onChange={() => handleOptionChange(option.id)}
                                />
                                <span className="radio-button-label">{option.label}</span>
                            </label>
                        ))}
                    </div>

                    {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                </div>
                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default QuestionFive;