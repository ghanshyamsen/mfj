import React, {useState} from 'react';
import { useWizard } from "react-use-wizard";

function QuestionTen({GoNextStep, GoBackStep, data, assessment, setAssessment}) {
    const [selectedOption, setSelectedOption] = useState(assessment?.answer);
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {
        if(!selectedOption){
            setError("Please select an option.");
            return
        }
        GoNextStep();
        nextStep();
    }


    const handleOptionChange = (index,option) => {
        setError(false);
        setSelectedOption(option);

        setAssessment(9,{
            question: data?.question,
            answer: option,
            type: data?.type[index]
        });
    }

    return(
        <>
            <div className=''>

                <div className="rim_content">
                    <h1 className="rim_heading">{data?.question}</h1>
                </div>

                <div className="custom-radio-buttons">
                    <div className='crb_inside'>
                        {data?.options.map((value, index) => (
                            <label key={index} className={`radio-button ${selectedOption === value ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    value={value}
                                    checked={selectedOption == value}
                                    onChange={() => handleOptionChange(index, value)}
                                />
                                <span className="radio-button-label">{value}</span>
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

export default QuestionTen;