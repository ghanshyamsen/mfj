import React, { useState, useEffect,useRef } from "react";
import Plus from '../../../assets/images/plus.svg';
import Close from '../../../assets/images/close.svg';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import Autocomplete from "react-google-autocomplete";

import { Skeleton } from 'primereact/skeleton';
import { useNavigate } from 'react-router-dom';

import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';


function JobPreferences() {
    const [showInput, setShowInput] = useState(false);
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [jobTitles, setJobTitles] = useState([]);
    const [newJobTitle, setNewJobTitle] = useState("");
    const [radius, setRadius] = useState("");

    const [jobLocations, setJobLocations] = useState([]);
    const [newJobLocation, setNewJobLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const TOKEN = localStorage.getItem('token');
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [errors, setErrors] = useState({});
    const [joblist, setJobList] = useState([]);

    const titleRef = useRef(null);
    const locationRef = useRef(null);

    const navigate = useNavigate();

    const handleAddJobTitle = (e) => {

        const isExists = jobTitles.some(value => value.toLowerCase() === newJobTitle.toLowerCase());
        if(isExists){
            window.find(newJobTitle);
            setErrors({...errors, ['title']:`${newJobTitle}, Job type already exists.`});
            return;
        }

        setErrors({...errors, ['title']:''});


        if (newJobTitle.trim() !== "") { /* e.key === 'Enter' && */
            setJobTitles([...jobTitles, newJobTitle]);
            setNewJobTitle("");
            setShowInput(false);
        }else{
            setErrors({...errors, ['title']:'Please select the job types from the dropdown'});
        }
    };

    const handleAddJobLocation = (e) =>{

        const isExists = jobLocations.some(value => value.location === newJobLocation.location);
        if(isExists){
            window.find(newJobLocation.location);
            setErrors({...errors, ['location']:`${newJobLocation.location}, Job location already exists.`});
            return;
        }

        setErrors({...errors, ['location']:''});

        if (newJobLocation.location && newJobLocation.location.trim() !== "") {
            setJobLocations([...jobLocations, newJobLocation]);
            setNewJobLocation("");
            setShowLocationInput(false);
        }else{
            setErrors({...errors, ['location']:'Please enter the job location'});
        }
    };

    const handleRemoveJobTitle = (indexToRemove) => {
        setJobTitles(jobTitles.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveJobLocation = (indexToRemove) => {
        setJobLocations(jobLocations.filter((_, index) => index !== indexToRemove));
    };

    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'S'){
                if(result.data?.job_prefernces?.job_titles?.length > 0){
                    setJobTitles(result.data.job_prefernces.job_titles);
                }


                if(result.data?.job_prefernces?.job_locations?.length > 0){
                    setJobLocations(result.data.job_prefernces.job_locations);
                }

                setRadius(result.data?.job_prefernces?.location_radius);

            }

            setLoading(true);
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

        getJobList()
    },[])

    useEffect(() => {
        if(loading){
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                job_prefernces: {
                    job_titles: jobTitles,
                    job_locations: jobLocations,
                    location_radius: radius
                },
                job_prefernces_complete_status: true
            });

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/update-resume`, requestOptions)
            .then((response) => response.json())
            .then((result) => {

            })
            .catch((error) => console.error(error))
            .finally(() => setLoadingSkeleton(false));
        }

    },[jobTitles,jobLocations, radius])




    const getJobList = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/find-job-suggestions?all=true`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                const groupedByCategory = result.data.reduce((acc, curr) => {
                    const category = curr.job_category.title;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(curr);
                    return acc;
                }, {});
                const groupedByCategoryArray = Object.entries(groupedByCategory);
                setJobList(groupedByCategoryArray);
            }
        })
        .catch((error) => console.error(error.message));
    }

    const handleSubmit = () => {
        if(jobTitles.length > 0 || jobLocations.length > 0) {
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Job Preferences');
        }
        navigate('/dashboard');
    };


    return (
        <>
            <div className="common_background_block job_preferences_page">
                <div className="dashboard_content_block common_card">
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='40px' /> : 'Job Preferences' } </h1>
                    <div className=''>
                        {!showInput && (
                            <>
                                {loadingSkeleton ?
                                    <Skeleton width="100%" height='66px' />
                                :
                                    <button className="add_education" onClick={() => {
                                        setShowInput(true)
                                        setTimeout(() => {
                                            titleRef.current.focus();
                                        }, 300);
                                    }}>
                                        <img src={Plus} alt="" /> <span> Add Preferred Job Titles </span>
                                    </button>
                                }
                            </>
                        )}

                        {showInput && (
                            <>
                                <FloatingLabel controlId="floatineducation" label={<span> Preferred Job Titles <span className='required'>*</span> </span>} className="mb-3">
                                    {/* <Form.Control
                                        value={newJobTitle}
                                        onChange={(e) => setNewJobTitle(e.target.value)}
                                        //onKeyPress={handleAddJobTitle}
                                        placeholder=""
                                        maxLength="100"
                                        ref={titleRef}
                                    /> */}
                                    <Form.Select ref={titleRef} aria-label="Floating Default select example"  value={newJobTitle}  onChange={(e) => setNewJobTitle(e.target.value)}>
                                        <option value="">Select</option>
                                            {joblist.map(([category, jobs]) => (
                                                <optgroup key={category} label={category}>
                                                    {jobs.map((job) => (
                                                        <option key={job._id} value={job.job_title}>
                                                            {job.job_title}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </Form.Select>
                                    {errors.title && <small className="error">{errors.title}</small>}
                                </FloatingLabel>



                                <button className="btn submit_btn add_btn" onClick={handleAddJobTitle} type="button"> Add </button>
                            </>
                        )}
                    </div>

                    <div className="job_title_row mb-2">
                        {jobTitles.map((title, index) => (
                            loadingSkeleton ? <Skeleton width="200px" height='32px' key={'skl'+index} className="mb-1"/>
                            :
                            <div key={index} className="job_title_item">
                                {title}
                                <button type="button" className="close-btn" onClick={() => handleRemoveJobTitle(index)}>
                                    <img src={Close} alt="" />
                                </button>
                            </div>

                        ))}
                    </div>

                    {/* Job Locations Section */}
                    <div className=''>
                        {!showLocationInput && (
                            <>
                                { loadingSkeleton ?
                                    <Skeleton width="100%" height='66px' />
                                    :
                                    <button className="add_education" onClick={() => {
                                        setShowLocationInput(true)
                                        setTimeout(() => {
                                            locationRef.current.focus();
                                        },300)

                                    }}>
                                        <img src={Plus} alt="" /> <span> Add Locations </span>
                                    </button>
                                }
                            </>
                        )}

                        {showLocationInput && (
                            <>
                                <FloatingLabel controlId="floatingLocation" label={<span> Enter location <span className='required'>*</span> </span>} className="mb-3">
                                    <Autocomplete
                                        className="form-control"
                                        apiKey= {process.env.REACT_APP_LOCATION_API_KEY}
                                        onPlaceSelected={(place) => {
                                            const location = place.formatted_address || place.description || ''; // Use the correct property that holds the address
                                            const latitude = place.geometry.location.lat();
                                            const longitude = place.geometry.location.lng();

                                            setNewJobLocation({
                                                location,
                                                latitude,
                                                longitude
                                            })

                                        }}
                                        options={{
                                            types: ['geocode'], // or 'address' if you need full address
                                            componentRestrictions: { country: 'us' }, // restrict to specific country if needed
                                            fields: ['address_components', 'geometry', 'formatted_address'], // specify the fields you need
                                            disableAutoPan: true
                                        }}
                                        placeholder=""
                                        ref={locationRef}
                                    />
                                    {errors.location && <small className="error">{errors.location}</small>}
                                </FloatingLabel>
                                <button className="btn submit_btn add_btn" onClick={handleAddJobLocation} type="button"> Add </button>
                            </>
                        )}

                    </div>

                    <div className="job_locations_row">
                        {jobLocations.map((location, index) => (

                            loadingSkeleton ? <Skeleton width="230px" height='32px' className="mb-1" key={'slkl_'+index}/> :
                            <div key={index} className="job_location_item">
                                {location.location}
                                <button type="button" className="close-btn" onClick={() => handleRemoveJobLocation(index)}>
                                    <img src={Close} alt="" />
                                </button>
                            </div>

                        ))}
                    </div>

                    <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingSelect" label="Location Radius">
                            <Form.Select aria-label="Floating label select example" name='location_miles' value={radius} onChange={(e) => setRadius(e.target.value)} >
                                <option value="">Anywhere from the location</option>
                                <option value="10">10 Miles</option>
                                <option value="20">20 Miles</option>
                                <option value="30">30 Miles</option>
                                <option value="40">40 Miles</option>
                                <option value="50">50 Miles</option>
                                <option value="60">60 Miles</option>
                                <option value="70">70 Miles</option>
                                <option value="80">80 Miles</option>
                                <option value="90">90 Miles</option>
                                <option value="100">100 Miles</option>
                            </Form.Select>
                        </FloatingLabel>
                        <p className="phone_Text"> e.g., Travel for work within 30 miles of the your's home </p>
                    </div>

                    <div className='btn_block'>
                        <button type="button" className='btn submit_btn mb-2' onClick={handleSubmit}>Save and Exit</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default JobPreferences;
