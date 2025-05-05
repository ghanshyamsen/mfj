import React, { useState, useEffect,useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Autocomplete from "react-google-autocomplete";
import { Skeleton } from 'primereact/skeleton';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';
import { useProfile } from '../../../ProfileContext';
import { InputSwitch } from 'primereact/inputswitch';
import Briefcase from '../../../assets/images/Briefcase.svg';


function JobPreferences() {


    const TOKEN = localStorage.getItem('token');
    const {theme} = useProfile();
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [joblist, setJobList] = useState([]);
    const [addressChange, setAdressChange] = useState(''); // Define
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    const [formData, setFormData] = useState({
        job_titles: [],
        job_location:{
            location: '',
            latitude: '',
            longitude: ''
        },
        location_miles: "",
        open_for_remote:true,
        job_type: [],
        shift_type: [],
        weekly_days: [],
        weekly_hours: [],
    });


    const handleChange = (event) => {

        if (event.target.name === 'weekly_days') {
            setFormData(prev => {
                const updatedDays = event.target.checked
                    ? [...prev.weekly_days, event.target.value] // Add value
                    : prev.weekly_days.filter(day => day !== event.target.value); // Remove value

                return {
                    ...prev,
                    weekly_days: updatedDays
                };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [event.target.name]: event.target.value
            }));
        }
    }

    const handleLocation = (place) => {

        const location = place.formatted_address || place.description || ''; // Use the correct property that holds the address
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();


        const addressComponents = place.address_components || [];

        let street = '';
        let city = '';
        let state = '';
        let zipcode = '';
        addressComponents.forEach(component => {

            const types = component.types;

            if (types.includes('street_number')) {
                street += component.long_name + ' ';
            }

            if (types.includes('route')) {
                street += component.long_name;
            }

            if (types.includes('locality')) {
                city = component.long_name;
            }

            if (types.includes('administrative_area_level_1')) {
                state = component.short_name; // Use short_name for state abbreviations like 'NY'
            }

            if (types.includes('postal_code')) {
                zipcode = component.long_name;
            }

        });

        setAdressChange(location);

        setFormData(prev => ({
            ...prev,
            job_location:{
                location: location,
                latitude: latitude,
                longitude: longitude,
                street_address:street,
                city: city,
                state: state,
                zip_code: zipcode
            }
        }))
    }

    const handleAddr = (e) => {
        if(!e.target.value){
            setFormData(prev => ({
                ...prev,
                job_location:{
                    location: e.target.value,
                    latitude: '',
                    longitude: '',
                    street_address:'',
                    city: '',
                    state: '',
                    zip_code: ''
                }
            }))
        }

    }

    const titleRef = useRef(null);
    const locationRef = useRef(null);

    const navigate = useNavigate();

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
                setFormData({...formData, ...result.data?.job_prefernces});
                setAdressChange(result.data?.job_prefernces?.job_location?.location);
            }

            setLoading(true);
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

        getJobList()
    },[])


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

                const grouped = result.data.reduce((acc, job) => {
                    // Find existing category group
                    let categoryGroup = acc.find(group => group.code === job.job_category._id);

                    // If not found, create a new category group
                    if (!categoryGroup) {
                        categoryGroup = {
                            label: job.job_category.title,
                            code: job.job_category._id,
                            items: []
                        };
                        acc.push(categoryGroup);
                    }

                    // Add the job to the category group
                    categoryGroup.items.push({
                        label: job.job_title,
                        value: job._id
                    });

                    return acc;
                }, []);

                setJobList(grouped);
            }
        })
        .catch((error) => console.error(error.message));
    }

    const validation = (data) => {
        const errors = {};

        if(data?.job_titles?.length === 0){
            errors.job_titles = "Job Titles is required.";
        }

        if(!data?.job_location?.location){
            errors.location = "Location is required.";
        }

        if((!data?.job_location?.location || (data?.job_location?.location && !data?.job_location?.location?.trim()) || (addressChange!==data?.job_location?.location))){
            errors.location = "Please select an address from the dropdown";
        }

        return errors;
    }

    const handleSubmit = () => {

        const validated = validation(formData);
        if(Object.keys(validated).length > 0) {
            setErrors(validated);
            return
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            job_prefernces: formData,
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
            sessionStorage.setItem('showCompleteModal', 'true');
            sessionStorage.setItem('step_title', 'Job Preferences');
            navigate('/dashboard');
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));

    };

    const groupedItemTemplate = (option) => {
        return (
            <div className="flex align-items-center" style={{padding: '10px 30px',borderBottom: '1px solid #cac7c7'}}>
                <div>{option.label}</div>
            </div>
        );
    };

    const jobtypes = [
        { code: "Full-time", title: "Full-time"},
        { code: "Part-time", title: "Part-time"},
        { code: "Contract", title: "Contract"},
        { code: "Temporary", title: "Temporary"},
        { code: "Internship", title: "Internship"},
        { code: "Seasonal", title: "Seasonal"}
    ]

    const shift_type = [
        {code: "Morning", name:"Morning"},
        {code: "Afternoon", name:"Afternoon"},
        {code: "Evening", name:"Evening"}
    ]

    const weekly_hours = [
        {code: "10-20 Hours", name:"10-20 Hours"},
        {code: "20-30 Hours", name:"20-30 Hours"},
        {code: "30-40 Hours", name:"30-40 Hours"},
        {code: "40-50 Hours", name:"40-50 Hours"},
        {code: "50-60 Hours", name:"50-60 Hours"}
    ]

    const week_days = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Flexible"
    ]

    const [checked, setChecked] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
            <div className="common_background_block job_preferences_page">
                <div className="dashboard_content_block common_card">
                    <button className='work_btn btn submit_btn' onClick={handleShow}> How it works? </button>

                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='40px' /> : 'Job Preferences' } </h1>

                    <h4 className="d_sub_title">Job Title and Type</h4>

                    <FloatLabel className='form-group mb-3'>
                        <MultiSelect
                            value={formData.job_titles || []}
                            name="job_titles"
                            onChange={handleChange}
                            options={joblist}
                            optionLabel="label"
                            optionGroupLabel="label"
                            optionGroupChildren="items"
                            optionGroupTemplate={groupedItemTemplate}
                            className="w-full"
                            showSelectAll={false}
                            filter
                        />
                        <label htmlFor="ms-benefits">Preferred Job Titles</label>
                        {errors.job_titles && <small className='error' style={{color:'red'}} >{errors.job_titles}</small>}
                    </FloatLabel>

                    <FloatLabel className='form-group mb-3'>
                        <MultiSelect
                            value={formData.job_type || []}
                            name="job_type"
                            onChange={handleChange}
                            options={jobtypes}
                            optionLabel="title"
                            optionValue="title"
                            className="w-full"
                            showSelectAll={false}
                        />
                        <label htmlFor="ms-benefits">Preferred Job Types</label>
                        {errors.job_types && <small className='error' style={{color:'red'}} >{errors.job_types}</small>}
                    </FloatLabel>

                </div>

                <div className="common_card">

                    <h4 className="d_sub_title"> Location Preferences </h4>

                    <FloatingLabel controlId="floatingLocation" label={<span> Enter location <span className='required'>*</span> </span>} className="mb-3">
                        <Autocomplete
                            className="form-control"
                            name="location"
                            apiKey= {process.env.REACT_APP_LOCATION_API_KEY}
                            defaultValue={formData.job_location.location||''}
                            onPlaceSelected={handleLocation}
                            /* options={{
                                types: ['geocode'], // or 'address' if you need full address
                                componentRestrictions: { country: 'us' }, // restrict to specific country if needed
                                fields: ['address_components', 'geometry', 'formatted_address'], // specify the fields you need
                                disableAutoPan: true
                            }} */
                            placeholder=""
                            onChange={handleAddr}
                        />
                        {errors.location && <small className='error' style={{color:'red'}} >{errors.location}</small>}
                        <p className="phone_Text mb-3">Eg.: Philadelphia, PA, USA </p>
                    </FloatingLabel>

                    <div className='form-group mb-3'>
                        <FloatingLabel controlId="floatingSelect" label="Location Radius">
                            <Form.Select aria-label="Floating label select example" name='location_miles' value={formData.location_miles||''} onChange={handleChange} >
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
                            <p className="phone_Text"> e.g., Travel for work within 30 miles of your home. </p>
                        </FloatingLabel>
                    </div>

                    <div className="switch_btn_block">
                        <span> Are you open for Remote/Hybrid/On the Road  </span>
                        <InputSwitch name="open_for_remote" checked={formData.open_for_remote} onChange={handleChange} />
                    </div>

                </div>

                <div className="common_card">
                    <div className='hobbies_select_block' style={{height:"auto"}}>
                        <div className="rim_content">
                            <h6 className="">Weekly Availability</h6>
                        </div>
                        <div  className='hobbies_type_block'>
                            {week_days.map((value, i) => (
                                <label key={i} className="checkbox">
                                    <input type="checkbox" name="weekly_days" value={value}  checked={formData?.weekly_days.some(item => item === value)} onChange={handleChange} />
                                    <span className="checkmark">{value}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <FloatLabel className='form-group mb-3'>
                        <MultiSelect
                            value={formData?.weekly_hours || []}
                            name="weekly_hours"
                            onChange={handleChange}
                            options={weekly_hours}
                            optionLabel="name"
                            optionValue="code"
                            className="w-full"
                        />
                        <label htmlFor="ms-benefits">Preferred Weekly Hours</label>
                        {errors.weekly_hours && <small className='error' style={{color:'red'}} >{errors.weekly_hours}</small>}
                    </FloatLabel>

                    <FloatLabel className='form-group mb-0'>
                        <MultiSelect
                            value={formData?.shift_type || []}
                            name="shift_type"
                            onChange={handleChange}
                            options={shift_type}
                            optionLabel="name"
                            optionValue="code"
                            className="w-full"
                        />
                        <label htmlFor="ms-benefits">Shift Type</label>
                        {errors.shift_type && <small className='error' style={{color:'red'}} >{errors.shift_type}</small>}
                    </FloatLabel>
                </div>

                <div className="common_card">
                    <div className='btn_block'>
                        <button type="button" className='btn submit_btn m-0' onClick={handleSubmit}>Save and Exit</button>
                    </div>
                </div>

            </div>

            <Modal className={`dashboard_modals ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                        <div className='icons'>
                            <img src={Briefcase} alt="" />
                        </div>
                </Modal.Header>
                <Modal.Body>
                <div className='modal_content'>
                    {/* <h1 className='heading mb-4'> Job Preferences </h1> */}
                    <div className="make_resume_content_block">
                        <div className="make_resume_content">
                            <h2 className="mrc_heading"> Welcome to the Job Preferences Section </h2>
                            <p className="src_desc"> This section is your chance to tell potential employers about the types of jobs that excite you and why. Even if you’ve never worked before, you probably have an idea of what interests you—whether it's working outdoors, thriving in busy environments like restaurants, or putting your organizational skills to use. </p>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> How It Works </h2>
                            <ul className="">
                                <li> You’ll select from a list of job titles and industries that match your interests. </li>
                                <li> If you have specific roles in mind, you can add your own job preferences. </li>
                                <li> This section will help us match you to roles where you can shine. </li>
                            </ul>
                        </div>
                        <div className="make_resume_content">
                            <h2 className="mrc_title"> Why It Matters </h2>
                            <p className="src_desc"> By the end of this section, you’ll have identified the job roles that feel like the best fit for you, where you can grow, learn, and start building your career path. Think of this as setting the stage for your future work life by highlighting the environments and roles where you believe you'll thrive the most. </p>
                        </div>
                    </div>
                </div>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default JobPreferences;


