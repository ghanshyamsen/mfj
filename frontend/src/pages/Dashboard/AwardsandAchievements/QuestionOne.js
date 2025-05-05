import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


function QuestionOne({GoNextStep, goDashboardPage, award, setAward}) {

    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const { nextStep } = useWizard();

    const closeInfomastion = () => {
        goDashboardPage();
    }

    useEffect(()=>{
        if(award){
            setTitle(award.answer)
        }
    },[award])

    const handleClickNext = () => {

        if(!title.trim()){
            setError("Title is required.");
            return
        }

        setAward(0,{
            "label": "Title",
            "question": "Enter the Award or Achievement Name",
            "subtext" : "Please list the name of an award or recognition you have received.",
            "answer": title,
            "certification_name": title,
            "question_tag": "certification_name"
        });

        GoNextStep();
        nextStep();
    }

    const handleChange = (e) => {
        setTitle(e.target.value);
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Enter the Award or Achievement Name</h1>
                    <p>Please list the name of an award or recognition you have received.</p>
                </div>

                <div className='education_fields'>
                    <FloatingLabel controlId="floatinawards" className="mb-3"
                     label={<span> Title <span className='required'>*</span> </span>}
                    >
                        <Form.Control
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {error && <small style={{color:"red"}}>{error}</small>}
                    </FloatingLabel>
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