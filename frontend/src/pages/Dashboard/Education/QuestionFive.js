import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel';

function QuestionFive({GoBackStep, GoNextStep, education, setEducation, last}) {
    const [endDate, setEndDate] = useState("");
    const [errors, setErrors] = useState("");
    const { nextStep, previousStep } = useWizard();

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }


    useEffect(() => {
        if(education){
            setEndDate(window.parseDateString(education.answer));
        }
    },[])

    const handleClickNext = () => {


        if(!endDate){
            setErrors('Please enter an end date.')
            return
        }else{
            if(new Date((last.answer)) > new Date((endDate))){
                setErrors('End date must be greater than start date.')
                return
            }
        }
        setErrors('')
        setEducation(4,{
            label:"End Date",
            question: "Choose the End Date of Education (or expected)",
            answer: window.formatmdyDate(endDate),
            graduation_end_year: window.formatmdyDate(endDate),
            question_tag: "graduation_end_year"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setEndDate(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Choose the End Date of Education (or expected)</h1>
                </div>
                <div className='education_fields'>
                    <FloatLabel className="mb-3">
                        <Calendar
                            name="enddate"
                            value={endDate?new Date(endDate):''}
                            onChange={handleChange}
                            maxLength="25"
                            dateFormat="mm/yy"
                            placeholder=''
                            view="month"
                        />
                        <label htmlFor="enddate">End Date <span className='required'>*</span></label>
                    </FloatLabel>
                    {errors && <small className='error' style={{color:"red"}}>{errors}</small>}
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