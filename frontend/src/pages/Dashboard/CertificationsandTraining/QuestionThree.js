import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel'

function QuestionThree({GoBackStep, GoNextStep, certificate, setCertificate}) {
    const [issuedate, setIssueDate] = useState("");
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();


    useEffect(() => {
        if(certificate?.answer){
            setIssueDate(window.parseDateString(certificate.answer));
        }
    },[certificate])

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }


    const handleClickNext = () => {


        if(!issuedate){
            setError("Issue date is required.");
            return
        }

        setCertificate(2, {
            "question": "Enter the Date Completed",
            "subtext" : "When did you complete this certification or training? (Month and Year)",
            "answer": window.formatmdyDate(issuedate),
            "issue_date": window.formatmdyDate(issuedate),
            "question_tag": "issue_date",
            "label": "Issue date"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setIssueDate(e.target.value);
    }



    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the Date Completed</h1>
                    <p>When did you complete this certification or training? (Month and Year)</p>
                </div>

                <div className='education_fields'>
                    <FloatLabel className="mb-3">
                        <Calendar
                            name="issuedate"
                            value={issuedate?new Date(issuedate):''}
                            onChange={handleChange}
                            dateFormat="mm/yy"
                            placeholder=''
                            maxDate={new Date()}
                            view="month"
                        />
                        <label htmlFor="issuedate">Issue Date  <span className='required'>*</span></label>
                    </FloatLabel>
                    {error  && <small style={{color:"red"}}>{error}</small>}
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