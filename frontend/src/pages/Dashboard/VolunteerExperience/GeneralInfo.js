import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
function GeneralInfo({GoNextStep, goDashboardPage, vexperience, setVExperience}) {
    const { nextStep } = useWizard();



    const formatmdyDate = (dateString, separator = '-') => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}${separator}${day}${separator}${year}`;
    };

    const handleClickNext = async () => {
        let FormDataObj = formdata;
        // Validate the form data
        const validationErrors = await validateForm(formdata);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        setVExperience(0,{
            title:"General info",
            info:[
                {
                    question:"Name of the organization",
                    answer: formdata.organizationname,
                    organizationname: formdata.organizationname,
                    question_tag:"organizationname"
                },
                {
                    question:"Start date",
                    answer: formatmdyDate(formdata.startdate),
                    startdate: formatmdyDate(formdata.startdate),
                    question_tag:"startdate"
                },
                {
                    question:"End date",
                    answer: (formdata.enddate?formatmdyDate(formdata.enddate):''),
                    enddate: (formdata.enddate?formatmdyDate(formdata.enddate):''),
                    question_tag:"enddate"
                },
                {
                    question:"Total hours",
                    answer: formdata.totalhours,
                    totalhours: formdata.totalhours,
                    question_tag:"totalhours"
                }
            ]
        });

        GoNextStep();
        nextStep();
    }

    const [formdata, setFromData] = useState({
        organizationname:"",
        startdate:"",
        enddate:"",
        totalhours:""
    });

    const [errors, setErrors] = useState({});

    const validateForm = (data) => {
        const errors = {};

        // You can add more validation logic here
        if(!data.organizationname.trim()){
            errors.organizationname = "Organization name is required.";
        }

        if(!data.startdate){
            errors.startdate = "Start date is required.";
        }

        // if(!data.enddate){
        //     errors.enddate = "End date is required.";
        // }


        if(data.startdate && data.enddate && ((new Date((data.startdate)) > new Date((data.enddate))) || !window.isStartBeforeEnd((data.startdate), (data.enddate)))){
            errors.enddate = "End date must be greater than start date.";
        }

        if(data.enddate && !data.totalhours){
            errors.totalhours = "Total hours is required.";
        }else{
            if(data.enddate && (data.totalhours > 1000 || data.totalhours < 1)){
                errors.totalhours = "Total hours must be between min 1 to max 1000.";
            }
        }

        return errors;
    }

    const handleChange = (e) => {

        if(e.target.name ==='totalhours'){
            e.target.value = window.formatToTwoDecimalPlaces(e.target.value);
        }

        setFromData({...formdata,[e.target.name]: e.target.value});
    }

    useEffect(() => {
        if (vexperience) {
          const data = vexperience;
          const info = {};

          data.info.forEach((value) => {
            if(value.question_tag === 'startdate' || value.question_tag === 'enddate'){
                value.answer = value.answer?window.parseDateString(value.answer):'';
            }

            info[value.question_tag] = value.answer;
          });

          setFromData(info);
        }
    }, [vexperience]);


    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">General info</h1>
                </div>
                <div className=''>
                    <FloatingLabel controlId="floatingorganization" label={<span> Name of the organization <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control
                            type="text"
                            name="organizationname"
                            value={formdata.organizationname||''}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder=""
                        />
                        {errors.organizationname && <div className="error-message text-danger">{errors.organizationname}</div>}
                    </FloatingLabel>
                </div>
                <div className='mb-3'>
                    <FloatLabel className="" >
                        <Calendar
                            name="startdate"
                            value={formdata.startdate?new Date((formdata.startdate)):''}
                            onChange={handleChange}
                            maxLength="25"
                            dateFormat="mm/yy"
                            placeholder=''
                            maxDate={new Date()}
                            view="month"
                        />
                        <label htmlFor="startdate">Start Date <span className='required'>*</span></label>
                    </FloatLabel>
                    {errors.startdate && <div className="error-message text-danger">{errors.startdate}</div>}
                </div>
                <div className=''>
                    <FloatLabel className="mb-3">
                        <Calendar
                            name="enddate"
                            value={formdata.enddate?new Date((formdata.enddate)):""}
                            onChange={handleChange}
                            maxLength="25"
                            dateFormat="mm/yy"
                            placeholder=''
                            view="month"
                        />
                        <label htmlFor="enddate">End Date </label>
                        <p className="phone_Text"> Skip if you’re currently working in this role </p>
                    </FloatLabel>
                    {errors.enddate && <div className="error-message text-danger">{errors.enddate}</div>}
                </div>
                <div className=''>
                    <FloatingLabel controlId="floatingorganization" label={<span> 
                                    Total hours {formdata.enddate && <span className='required'>*</span>}  
                                    </span>} className="mb-3">
                        <Form.Control
                            type="number"
                            name="totalhours"
                            value={formdata.totalhours||""}
                            onChange={handleChange}
                            min="1"
                            max="1000"
                            placeholder=""
                        />
                        {errors.totalhours && <div className="error-message text-danger">{errors.totalhours}</div>}
                    </FloatingLabel>
                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>
        </>
    )
}

export default GeneralInfo;