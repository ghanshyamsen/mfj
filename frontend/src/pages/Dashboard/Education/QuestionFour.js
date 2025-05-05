import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel';
function QuestionFour({GoBackStep, GoNextStep, education, setEducation}) {
    const [startDate, setStartDate] = useState("");
    const [errors, setErrors] = useState("");
    const { nextStep, previousStep } = useWizard();

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    useEffect(() => {
        if(education){
            setStartDate(window.parseDateString(education.answer));
        }
    },[])

    const handleClickNext = () => {

        if(!startDate){
            setErrors('Please enter a start date.')
            return
        }

        setEducation(3,{
            label:"Start Date",
            question: "Select the Start Date of Education",
            answer: window.formatmdyDate(startDate),
            graduation_start_year: window.formatmdyDate(startDate),
            question_tag: "graduation_start_year"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        console.log(e.target.value);
        setStartDate(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Select the Start Date <br/> of Education</h1>
                </div>
                <div className='education_fields'>
                    <FloatLabel className="mb-3">
                        <Calendar
                            name="startdate"
                            value={startDate?new Date(startDate):''}
                            onChange={handleChange}
                            maxLength="25"
                            dateFormat="mm/yy"
                            placeholder=''
                            maxDate={new Date()}
                            view="month"
                        />
                        <label htmlFor="startdate">Start Date <span className='required'>*</span></label>
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

export default QuestionFour;