import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
function QuestionThree({GoBackStep, GoNextStep,  award, setAward}) {
    const [issuedate, setIssuedate] = useState("");
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();


    useEffect(()=>{
        if(award){
            setIssuedate(window.parseDateString(award.answer))
        }
    },[award])

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {

        if(!issuedate){
            setError("Issue date is required");
            return
        }

        setAward(2,{
            "label": "Issue date",
            "question": "Enter the Date Received",
            "subtext" : "When did you receive this award or achievement? (Month and Year)",
            "answer": window.formatmdyDate(issuedate),
            "date_received": window.formatmdyDate(issuedate),
            "question_tag": "date_received"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setIssuedate(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the Date Received</h1>
                    <p>When did you receive this award or achievement? (Month and Year)</p>
                </div>

                <div className='education_fields'>
                    <FloatLabel className="mb-3">
                        <Calendar
                            name="issuedate"
                            value={issuedate?new Date(issuedate):''}
                            onChange={handleChange}
                            placeholder=''
                            maxDate={new Date()}
                            dateFormat="mm/yy"
                            view="month"
                        />
                        <label htmlFor="issuedate">Issue Date <span className='required'>*</span> </label>
                    </FloatLabel>
                    {error && <small style={{color:"red"}}>{error}</small>}
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={handleClickBack}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default QuestionThree;