import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";

function QuestionTen({data, GoNextStep, GoBackStep, skillsAssessment, setSkillsAssessment}) {
    const [selectedOption, setSelectedOption] = useState("");
    const [errors, setErrors] = useState("");
    const { nextStep, previousStep } = useWizard();

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {
        if(selectedOption == ""){
            setErrors('Please select option.');
            return
        }
        GoNextStep();
        nextStep();
    }

    useEffect(()=>{
        if(skillsAssessment){
            setSelectedOption(skillsAssessment.option_value)
        }
    },[])

    const options = data.options;

    const handleOptionChange = (option) => {
        setSelectedOption(option.option_value);

        setSkillsAssessment(13,{
            "option_value": option.option_value,
            "point" : option.point,
            "question" : data.question,
            "option" : option.option,
            "skills" : option.skills
        });
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">{data.question}</h1>
                </div>
                <div className="custom-radio-buttons">
                    {options.map(option => (
                        <label key={option.option_value} className={`radio-button ${selectedOption === option.option_value ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                value={option.option_value}
                                checked={selectedOption == option.option_value}
                                onChange={() => handleOptionChange(option)}
                            />
                            <span className="radio-button-label">{option.option}</span>
                        </label>
                    ))}
                    {errors && <small style={{color:'red'}}>{errors}</small>}
                </div>
                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default QuestionTen;