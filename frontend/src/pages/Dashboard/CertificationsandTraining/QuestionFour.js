import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel';

function QuestionFour({GoBackStep, GoNextStep, certificate, setCertificate, lastData}) {
    const [expirationdate, setExpirationDate] = useState("");
    const [error, setError] = useState("");
    const { nextStep, previousStep } = useWizard();

    useEffect(() => {
        if(certificate?.answer){
            setExpirationDate(window.parseDateString(certificate.answer));
        }
    },[certificate])

    const handleClickBack = () => {
        GoBackStep();
        previousStep();
    }

    const handleClickNext = () => {


        if(expirationdate && (new Date(lastData.answer) > new Date(expirationdate))){
            setError("Expiration date must be greater than issue date.");
            return
        }

        setCertificate(3, {
            "question": "Enter the Expiration Date (if applicable)",
            "subtext" : "If your certification has an expiration date, please provide the date when it needs to be renewed or revalidated.",
            "answer": (expirationdate?window.formatmdyDate(expirationdate):''),
            "expiry_date": (expirationdate?window.formatmdyDate(expirationdate):''),
            "question_tag": "expiry_date",
            "label": "Expiration date"
        });



        GoNextStep();
        nextStep();
    }


    const handleChange = (event) => {
        setExpirationDate(event.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the Expiration Date <br/> (if applicable)</h1>
                    <p>If your certification has an expiration date, please provide the date when it needs to be renewed or revalidated.</p>
                </div>
                <div className='education_fields'>
                    <FloatLabel className="mb-3">
                        <Calendar
                            name="expirationdate"
                            value={expirationdate?new Date(expirationdate):''}
                            onChange={handleChange}
                            maxLength="25"
                            dateFormat="mm/yy"
                            placeholder=' '
                            view="month"
                        />
                        <p className="phone_Text"> Optional </p>
                        <label htmlFor="expirationdate">Expiration Date </label>
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

export default QuestionFour;