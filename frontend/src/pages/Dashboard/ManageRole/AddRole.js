import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import backArrow from '../../../assets/images/fi_arrow-left.svg';

import Form from 'react-bootstrap/Form';

function RadioButtonGroup({ groupName, options, selectedOption, handleOptionChange, disabled }) {
    return (
        <div className="radio-block">
            {options.map(option => (
                <label key={option.id} className={`radio-button ${selectedOption === option.id ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name={groupName}
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => handleOptionChange(groupName, option.id)}
                        disabled={disabled}
                    />
                    <span className="radio-button-label">{option.label}</span>
                </label>
            ))}
        </div>
    );
}

function AddRole() {

    const {key:rId} = useParams();
    const navigate = useNavigate();

    const TOKEN = localStorage.getItem('token');
    const [selectedOptions, setSelectedOptions] = useState({
        role_name: "",
        admin_access: false,
        job_posting: false,
        edit_job_position: false,
        view_applicants: false,
        communication: false,
        hire: false,
        search_candidates: false
        // Add more fields as needed
    });
    const [selectedValue, setSelectedValue] = useState('false');
    const [disabled, setDisabled] = useState(false);

    const [errors, setErrors] = useState('');

    useEffect(()=>{
        if(rId){
            fetchRole();
        }
    },[]);

    const fetchRole = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-role/${rId}`, requestOptions)
          .then((response) => response.json())
          .then((result) =>{
            if(result.status == 'error'){
                window.showToast(result.message, 'error');
            }else{
                setSelectedOptions(result.data);
                setSelectedValue(result.data.admin_access.toString())
                setDisabled(result.data.admin_access);
            }
          })
          .catch((error) => console.error(error));

    }

    const handleOptionChange = (groupName, optionId) => {

        let options = {...selectedOptions, [groupName]: optionId}
        setSelectedOptions(options);
    };



    const handleChange = (event) => {
        setSelectedValue(event.target.value);

        let bool = (event.target.value==='true'?true:false);

        setDisabled(bool);

        setSelectedOptions({
            ...selectedOptions,
            ['admin_access']:bool,
            ['job_posting']:bool,
            ['edit_job_position']:bool,
            ['view_applicants']:bool,
            ['communication']:bool,
            ['hire']:bool,
            ['search_candidates']:bool
        })
    };

    const radioOptions = [
        { id: false, label: 'No Access' },
        { id: true,  label: 'Full Access' }
    ];

    const handleSubmit = () => {

        if(selectedOptions.role_name.trim()==''){
            setErrors('Role name is required.');
            return
        }

        setErrors('');


        const URL = (rId)?`/app/update-role/${rId}`:'/app/add-role';
        const API_URL = process.env.REACT_APP_API_URL+URL;
        const METHOD = (rId)?'PATCH':'POST';

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify(selectedOptions);

        const requestOptions = {
            method: METHOD,
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(API_URL, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast(result.message, 'success');
                navigate('/manage-role');
            }else{
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error));

    }

    return (
        <div className="manage-role-page">
            <div className='manage_role_block'>
                <h1 className='page_title'><Link to="/manage-role" className="btn arrow_back_btn"> <img src={backArrow} alt="" /> </Link> {rId?'Edit':'Add'} Role</h1>


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Role Name</Form.Label>
                    <Form.Control type="text" name="role_name" placeholder="Enter role name" maxLength="100" onChange={(e)=>{
                        setSelectedOptions({
                            ...selectedOptions,
                            [e.target.name]:e.target.value
                        })
                    }} value={selectedOptions.role_name||''} />
                    {errors &&  <small style={{color:'red'}}>{errors}</small>}
                </Form.Group>


                <div className="radio-group">
                    Admin Access
                    <label className="radio-container">
                        Full
                        <input
                            type="radio"
                            name="custom-radio"
                            value={true}
                            checked={selectedValue === 'true'}
                            onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                    </label>
                    <label className="radio-container">
                        Partial
                        <input
                            type="radio"
                            name="custom-radio"
                            value={false}
                            checked={selectedValue === 'false'}
                            onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>

                <div className='access_permission_block'>
                    <h2 className='access_title'>Access Permission</h2>

                    <div className="nptb-td nptb_page_col">
                        <p className="page_name">Allow Job Posting</p>
                        <RadioButtonGroup
                            groupName="job_posting"
                            options={radioOptions}
                            selectedOption={selectedOptions.job_posting}
                            handleOptionChange={handleOptionChange}
                            disabled={disabled}
                        />
                    </div>

                    <div className="nptb-td nptb_page_col">
                        <p className="page_name">Allow Edit Job Positions / Step 3 </p>
                        <RadioButtonGroup
                            groupName="edit_job_position"
                            options={radioOptions}
                            selectedOption={selectedOptions.edit_job_position}
                            handleOptionChange={handleOptionChange}
                            disabled={disabled}
                        />
                    </div>

                    <div className="nptb-td nptb_page_col">
                        <p className="page_name"> View Applicant </p>
                        <RadioButtonGroup
                            groupName="view_applicants"
                            options={radioOptions}
                            selectedOption={selectedOptions.view_applicants}
                            handleOptionChange={handleOptionChange}
                            disabled={disabled}
                        />
                    </div>

                    <div className="nptb-td nptb_page_col">
                        <p className="page_name"> Communication  </p>
                        <RadioButtonGroup
                            groupName="communication"
                            options={radioOptions}
                            selectedOption={selectedOptions.communication}
                            handleOptionChange={handleOptionChange}
                            disabled={disabled}
                        />
                    </div>

                    <div className="nptb-td nptb_page_col">
                        <p className="page_name"> Hire </p>
                        <RadioButtonGroup
                            groupName="hire"
                            options={radioOptions}
                            selectedOption={selectedOptions.hire}
                            handleOptionChange={handleOptionChange}
                            disabled={disabled}
                        />
                    </div>

                    <div className="nptb-td nptb_page_col">
                        <p className="page_name"> Search Candidate  </p>
                        <RadioButtonGroup
                            groupName="search_candidates"
                            options={radioOptions}
                            selectedOption={selectedOptions.search_candidates}
                            handleOptionChange={handleOptionChange}
                            disabled={disabled}
                        />
                    </div>
                </div>


                <button type="submit" className="btn submit_btn w-25" onClick={handleSubmit}> Save </button>
            </div>
        </div>
    );
}

export default AddRole;
