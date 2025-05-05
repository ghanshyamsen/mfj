import React, {useState, useEffect} from 'react';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import backArrow from '../../../assets/images/fi_arrow-left.svg';

import SweetAlert from 'react-bootstrap-sweetalert';
import Autocomplete from "react-google-autocomplete";

import { Link, useParams, useNavigate } from 'react-router-dom';

import { Skeleton } from 'primereact/skeleton';

import { AutoComplete } from "primereact/autocomplete";
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';

function formatToTwoDecimalPlaces(number) {
    // Convert the number to a string
    const numberString = number.toString();

    // Check if the number has a decimal point
    if (numberString.includes('.')) {
        // Format to two decimal places
        let nnumber =  parseFloat(number);

        return (numberString.split('.')?.[1]?.length > 2)?nnumber.toFixed(2):nnumber;
    } else {
        // No decimal point, return as is or append ".00"
        return number; // Returns a string with ".00"
    }
}

function removeDecimal(num) {
    if (typeof num === 'number' || typeof num === 'string') {
      return Math.floor(num);
    } else {
      return num;
    }
}

function PostJob() {

    const {key:Id} = useParams();
    const history = useNavigate();

    const user = JSON.parse(localStorage.getItem('userData'));
    const userId = (user.user_type==='subuser')?user.admin_id:user._id;
    const TOKEN = localStorage.getItem('token');
    const [location, setLocation] = useState({});
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [addressChange, setAdressChange] = useState(''); // Define
    const [items, setItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [skills, setSkills] = useState([]);

    const [formData, setFormData] = useState({
        user_id:userId,
        job_position:"",
        job_description:"",
        location:"",
        latitude:"",
        longitude:"",
        job_min_amount:"",
        job_max_amount:"",
        job_location_type: "",
        work_authorization: "",
        work_authorization_requirement: "",
        job_type: '',
        job_experience_level: '',
        weekly_day_range: '',
        weekly_day_range_other: "",
        shift_time: "",
        other_shift_time:"",
        expected_hours: "",
        expected_min_hour: "",
        expected_max_hour: "",
        job_pay_type: "",
        job_pay_type_other: "",
        job_pay_frequency: "",
        job_benefits: [],
        job_benefits_other: "",
        pay_is_competitive:"",
        education_level:"",
        year_of_experience:"",
        required_skills:[],
        other_preferences:"",
        location_miles:""

    });

    const options = [
        { label: "Yes" },
        { label: "No" }
    ];

    useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: for smooth scrolling
        });


        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };


        fetch(`${process.env.REACT_APP_API_URL}/app/get-skills`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'S'){
                setSkills(result.data);
            }
        })
        .catch((error) => console.error(error));

        if(Id){

            fetch(`${process.env.REACT_APP_API_URL}/app/get-company-jobs/${Id}?user=${userId}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    setFormData(result.data);
                    setLocation({
                        location:result.data.location,
                        latitude:result.data.latitude,
                        longitude:result.data.longitude
                    });
                    setAdressChange(result.data.location);
                }else{
                    window.showToast("Invalid job request.","error");
                    history('/jobs');
                }
            })
            .catch((error) => console.error(error.message))
            .finally(() => setLoadingSkeleton(false));

            fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?job=${Id}&limit=5`, requestOptions)
            .then((response) => response.json())
            .then((result) =>  {
                if(result.status){
                    if(result.data.length > 0){
                        setCandidates(() => {
                            return result.data.filter(job => job.user_info.image).map(job => job.user_info.image);
                        });
                    }
                }else{
                    window.showToast(result.message,"error");
                }
            })
            .catch((error) => console.error(error));
        }
    },[]);

    const hasOther = Array.isArray(formData?.job_benefits) && formData?.job_benefits.some(val => val.toLowerCase() === 'other');
    const hasOther2 = Array.isArray(formData?.weekly_day_range) && formData?.weekly_day_range.some(val => val.toLowerCase() === 'other');
    const hasOther3 = Array.isArray(formData?.shift_time) && formData?.shift_time.some(val => val.toLowerCase() === 'other');

    const handleChange = (event) => {

        if(event.target.name ==='job_min_amount' || event.target.name === 'job_max_amount'){
            event.target.value = (event.target.value?formatToTwoDecimalPlaces(event.target.value):'');
        }

        if(event.target.name ==='expected_min_hour' || event.target.name === 'expected_max_hour'){
            event.target.value = (event.target.value?removeDecimal(event.target.value):'');
        }

        if(event.target.name ==='required_skills' && event.target.value.length > 5){
            window.showToast("You can't select more than 5 skills.",'error');
            return
        }



        setFormData({...formData, [event.target.name]:event.target.value});
    }

    const handleLocation = (place) => {

        const location = place.formatted_address || place.description || ''; // Use the correct property that holds the address
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        setAdressChange(location);

        setLocation({
            location,
            latitude,
            longitude
        });
    }

    const handleAddr = (e) => {
        setLocation({
            location:e.target.value,
            latitude:"",
            longitude:""
        });
    }

    const handlePost = (event) => {
        event.preventDefault();

        const validated = validation(formData);
        if(Object.keys(validated).length > 0) {
            setErrors(validated);

            setTimeout(() => {
                const firstErrorElement = document.querySelector('.error');

                if (firstErrorElement) {
                    const offset = 200; // Adjust this value to increase or decrease the top offset
                    const elementPosition = firstErrorElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                }
            },200)

            return
        }
        setErrors('');

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        var URL, METHOD;
        if(Id){
            URL = `${process.env.REACT_APP_API_URL}/app/update-job/${Id}`;
            METHOD = "PATCH";
        }else{
            URL = `${process.env.REACT_APP_API_URL}/app/create-job`;
            METHOD = "POST";
        }

        const formDataUpdate = {...formData,
            ["location"]: location.location,
            ["latitude"]: location.latitude,
            ["longitude"]: location.longitude
        };

        if(!Id){
            formDataUpdate.job_status = false;
        }

        const raw = JSON.stringify(formDataUpdate);

        const requestOptions = {
            method: METHOD,
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(URL, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                //
                if(!Id || !result.data.job_status) {
                    history(`/job-review/${result.data._id}`);
                }else{
                    window.showToast(result.message,"success");
                    history(`/jobs`);
                }
            }else{
                window.showToast(result.message,"error");
            }
        })
        .catch((error) => console.error(error.message));

        if(!user.job_published){

            const raw = JSON.stringify({
                job_published: true
            });

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${user._id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status === 'success'){
                    localStorage.setItem('userData',JSON.stringify(result.data));
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoadingSkeleton(false));
        }
    }

    const validation = (data) => {
        const errors = {};

        if(!data?.job_position?.trim()){
            errors.job_position = "Job position is required.";
        }


        if(!data?.job_location_type){
            errors.job_location_type = "Job location type is required.";
        }

        if(!data?.job_location_type === 'In-person at a precise location' && (!location?.location || (location?.location && !location?.location?.trim()) || (addressChange!==location.location))){
            errors.location = "Please select an address from the dropdown";
        }

        if(!data?.work_authorization){
            errors.work_authorization = "Work authorization is required.";
        }

        if(data?.work_authorization === 'Yes' && !data?.work_authorization_requirement){
            errors.work_authorization_requirement = "Work authorization requirement is required.";
        }

        if(!data?.job_type){
            errors.job_type = "Job type is required.";
        }

        if(!data?.job_experience_level){
            errors.job_experience_level = "Job experience level is required.";
        }

        if(!data?.weekly_day_range || data?.weekly_day_range.length === 0){
            errors.weekly_day_range = "Weekly day range is required.";
        }

        if(hasOther2 && !data?.weekly_day_range_other){
            errors.weekly_day_range_other = "This is required.";
        }

        if(!data?.shift_time || data?.shift_time.length === 0){
            errors.shift_time = "Shift time is required.";
        }

        if(hasOther3 && !data?.other_shift_time){
            errors.other_shift_time = "This is required.";
        }

        if(!data?.expected_hours){
            errors.expected_hours = "Expected weekly hours is required.";
        }

        if(data?.expected_hours === 'Range'){

            if(!data?.expected_min_hour || data?.expected_min_hour === 'e'){
                errors.expected_min_hour = "Min hours is required.";
            }else{
                if(data?.expected_min_hour <= 0){
                    errors.expected_min_hour = "Value must be greater than 1";
                }

                if(data?.expected_min_hour > 100){
                    errors.expected_min_hour = "Value must be lower than 100";
                }
            }

            if(!data?.expected_max_hour || data?.expected_max_hour === 'e'){
                errors.expected_max_hour = "Maximum hours is required.";
            }else{
                if(data.expected_min_hour && data.expected_max_hour && (parseFloat(data.expected_max_hour) < parseFloat(data.expected_min_hour))){
                    errors.expected_max_hour = "Max hours must be greater than min hours";
                }else if(data.expected_max_hour <= 0){
                    errors.expected_max_hour = "Value must be greater than 1";
                }

                if(data.expected_max_hour > 100){
                    errors.expected_max_hour = "Value must be lower than 100";
                }
            }
        }
        if(data?.expected_hours === 'Fixed Hours'){

            if(!data?.expected_min_hour || data?.expected_min_hour === 'e'){
                errors.expected_min_hour = "Fixed hours is required.";
            }else{
                if(data?.expected_min_hour <= 0){
                    errors.expected_min_hour = "Value must be greater than 1";
                }

                if(data?.expected_min_hour > 100){
                    errors.expected_min_hour = "Value must be lower than 100";
                }
            }
        }



        if(!data?.job_pay_type?.trim()){
            errors.job_pay_type = "Pay type is required.";
        }

        if(!data?.job_pay_frequency?.trim()){
            errors.job_pay_frequency = "Pay frequency is required.";
        }

        // if(!data?.job_benefits || data?.job_benefits.length === 0){
        //     errors.job_benefits = "Benefits is required.";
        // }

        if(data?.job_min_amount){
            if(data?.job_min_amount <= 0){
                errors.job_min_amount = "Value must be greater than 1";
            }

            if(data?.job_min_amount > 100000000){
                errors.job_min_amount = "Value must be lower than 100000000";
            }
        }

        if(data?.job_max_amount){

            if(data.job_min_amount && data.job_max_amount && (parseFloat(data.job_max_amount) < parseFloat(data.job_min_amount))){
                errors.job_max_amount = "Max amount must be greater than minimum amount";
            }else if(data.job_max_amount <= 0){
                errors.job_max_amount = "Amount must be greater than 1";
            }

            if(data.job_max_amount > 100000000){
                errors.job_max_amount = "Value must be lower than 100000000";
            }
        }

        if(!data?.pay_is_competitive){
            errors.pay_is_competitive = "This is required.";
        }

        if(!data?.job_description?.trim()){
            errors.job_description = "Description is required.";
        }

        return errors;
    }

    const deleteJob = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-job/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast(result.message,"success");
                history('/jobs');
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }

    const jobOpenClosed = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        var URL = `${process.env.REACT_APP_API_URL}/app/update-job/${Id}`;
        var METHOD = "PATCH";

        const raw = JSON.stringify({
            job_status:(formData.job_status?false:true)
        });

        const requestOptions = {
            method: METHOD,
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(URL, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                window.showToast((formData.job_status?"Job closed successfully.":"Job reopen successfully."),"success");
                setFormData(result.data);
            }else{
                window.showToast(result.message,"error");
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }

    const handleBack = () => {
        window.history.back();
    };

    const search = (event) => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/find-job-suggestions?keyword=${event.query}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setSuggestions(result.data);
                setItems(result.data.map(item => item.job_title));
            }
        })
        .catch((error) => console.error(error.message));
    }

    const selectSuggestion = (value) => {
        const val = suggestions.find(item => item.job_title === value) || {};

        setFormData({
            ...formData,
            job_position: value,
            job_description: val.job_description || '',
        });
    };

    useEffect(() => {
        const val = suggestions.find(item => item.job_title === formData.job_position) || {};

        if(!Id && val.job_description){
            setFormData({
                ...formData,
                job_description: val.job_description || '',
            });
        }
    }, [formData.job_position, suggestions]); // Only re-run effect when job_position or suggestions change

    /*  */
    const benefitsOption = [
        { code: '401(k)', name: '401(k)'},
        { code: 'Employee Discount', name: 'Employee Discount', },
        { code: 'Health Insurance', name: 'Health Insurance',},
        { code: 'Paid Time Off', name: 'Paid Time Off'},
        { code: 'Tips', name: 'Tips' },
        { code: 'Flexible Schedule', name: 'Flexible Schedule'},
        { code: 'Tuition Reimbursement', name: 'Tuition Reimbursement'},
        { code: 'Wellness Programs', name: 'Wellness Programs'},
        { code: 'Other', name: 'Other'}
    ];

    const weekly_day_range = [
        { code: 'Monday to Friday', name: 'Monday to Friday'},
        { code: 'Weekends Required', name: 'Weekends Required', },
        { code: 'Weekends as Necessary', name: 'Weekends as Necessary',},
        { code: 'Flexible', name: 'Flexible'},
        { code: 'Other', name: 'Other'}
    ];


    const shift_type = [
        {code: "Morning Shift", name:"Morning Shift"},
        {code: "Day Shift", name:"Day Shift"},
        {code: "Evening Shift", name:"Evening Shift"},
        {code: "Night Shift", name:"Night Shift"},
        {code: "4-Hour Shift", name:"4-Hour Shift"},
        {code: "8-Hour Shift", name:"8-Hour Shift"},
        {code: "10-Hour Shift", name:"10-Hour Shift"},
        {code: "12-Hour Shift", name:"12-Hour Shift"},
        {code: "Other", name:"Other"}
    ]

    /*  */



    return (
        <>
            <SweetAlert
                show={showAlert}
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Delete job post?"
                onConfirm={deleteJob}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                
            </SweetAlert>

            <div className="common_background_block company_job_openings_page">
                <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                {Id && formData.job_status && <div className='jobopening_job common_card mb-3'>
                    {loadingSkeleton ?
                        <div className='matched_block'>
                            <div className='matched_img'>
                                <Skeleton shape="circle" size="100%" />
                                <Skeleton shape="circle" size="100%" />
                                <Skeleton shape="circle" size="100%" />
                                <Skeleton shape="circle" size="100%" />
                                <Skeleton shape="circle" size="100%" />
                            </div>

                            <div className='match_title mb-2'> <Skeleton width="100%" height='30px' /> </div>
                            <div className='match_text mb-3'> <Skeleton width="100%" /> </div>
                            <Skeleton className='button' width="127px" height='34px' />
                        </div>
                    :
                        <div className='matched_block'>
                            {candidates.length > 0 && <div className='matched_img'>
                                {
                                    candidates.map((image, index) => <img key={index} src={image} alt=""/>)
                                }
                            </div>}

                            <h2 className='match_title'> Candidates are waiting </h2>
                            <p className='match_text'> Find out who has already applied for this job </p>
                            <Link to={`/candidates/${Id}`} className='btn get_btn'> See candidates </Link>
                        </div>
                    }
                </div>}

                <div className='jobopening_job common_card mb-3'>

                    <h1 className="d_title"> General Information </h1>

                    <div className="mb-3">
                        <FloatLabel>
                            <AutoComplete
                                name="job_position"
                                placeholder=""
                                value={formData.job_position||''}
                                suggestions={items}
                                completeMethod={search}
                                onChange={(e) => {
                                    selectSuggestion(e.value)
                                }}
                            />
                            <label htmlFor="ms-title">Title</label>
                        </FloatLabel>
                        {errors.job_position && <small className='error' style={{color:'red'}} >{errors.job_position}</small>}
                    </div>

                    <FloatingLabel controlId="floatingInput" label={<span> Job Type <span className='required'>*</span> </span>} className='mb-3'>
                        <Form.Select aria-label="Floating Default select example" name='job_type' value={formData.job_type || ''} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Temporary">Temporary</option>
                            <option value="Internship">Internship</option>
                            <option value="Seasonal">Seasonal</option>
                        </Form.Select>
                        {errors.job_type && <small className='error' style={{color:'red'}} >{errors.job_type}</small>}
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label={<span> Location Type <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Select aria-label="Floating Default select example" name='job_location_type' value={formData.job_location_type || ''} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="In-person at a precise location">In-person at a precise location</option>
                            <option value="In-person within a limited area">In-person within a limited area</option>
                            <option value="Fully Remote (no on-site work required)">Fully Remote (no on-site work required)</option>
                            <option value="Hybrid (some on-site work required)">Hybrid (some on-site work required)</option>
                            <option value="On the Road (travel-based work)">On the Road (travel-based work)</option>
                        </Form.Select>
                        {errors.job_location_type && <small className='error' style={{color:'red'}} >{errors.job_location_type}</small>}
                    </FloatingLabel>

                    {(formData?.job_location_type === 'In-person at a precise location' || formData?.job_location_type === 'In-person within a limited area') && <FloatingLabel controlId="floatingInput" label={<span> Location <span className='required'>*</span> </span>} className="mb-3">
                        <Autocomplete
                            className="form-control"
                            name="location"
                            apiKey= {process.env.REACT_APP_LOCATION_API_KEY}
                            defaultValue={formData.location||''}
                            onPlaceSelected={handleLocation}
                            options={{
                                types: ['geocode'], // or 'address' if you need full address
                                componentRestrictions: { country: 'us' }, // restrict to specific country if needed
                                fields: ['address_components', 'geometry', 'formatted_address'], // specify the fields you need
                                disableAutoPan: true
                            }}
                            placeholder=""
                            onChange={handleAddr}
                        />
                        {errors.location && <small className='error' style={{color:'red'}} >{errors.location}</small>}
                        <p className="phone_Text mb-3">Eg.: 2972 Westheimer Rd. Santa Ana, Illinois 85486 </p>



                        <FloatingLabel controlId="floatingMiles" label="Geo-location matching (e.g., within 30 miles)." className="mb-3">
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
                        </FloatingLabel>



                    </FloatingLabel>}


                    <FloatingLabel controlId="floatingInput" label={<span>Work Authorization <span className='required'>*</span> </span>} className='mb-3'>
                        <Form.Select aria-label="Floating Default select example" name='work_authorization' value={formData.work_authorization || ''} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No"> No </option>
                        </Form.Select>
                        {errors.work_authorization && <small className='error' style={{color:'red'}} >{errors.work_authorization}</small>}
                    </FloatingLabel>

                    {formData.work_authorization === 'Yes' && <FloatingLabel controlId="floatingWorkAuthorization" label={<span>Work Authorization Requirement <span className='required'>*</span> </span>} className='mb-3'>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name='work_authorization_requirement'
                            value={formData.work_authorization_requirement||''}
                            onChange={handleChange}
                            maxLength="200"
                        />
                        {errors.work_authorization_requirement && <small className='error' style={{color:'red'}} >{errors.work_authorization_requirement}</small>}
                    </FloatingLabel>}
                </div>

                {/* job detail */}
                <div className='jobopening_job common_card mb-3'>

                    <h1 className="d_title"> Job Details </h1>

                    <FloatingLabel controlId="floatingInput" label={<span> Experience Level <span className='required'>*</span> </span>} className='mb-3'>
                        <Form.Select aria-label="Floating Default select example" name='job_experience_level' value={formData.job_experience_level || ''} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="No Experience Needed">No Experience Needed</option>
                            <option value="Under 1 Year">Under 1 Year</option>
                            <option value="1 Year+">1 Year+</option>
                        </Form.Select>
                        {errors.job_experience_level && <small className='error' style={{color:'red'}} >{errors.job_experience_level}</small>}
                    </FloatingLabel>

                    <FloatingLabel controlId="EducationLevel" label="Education Level" className='mb-3'>
                        <Form.Select aria-label="Floating Default select example" name='education_level' value={formData.education_level || ''} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Some High School">Some High School</option>
                            <option value="GED"> GED </option>
                            <option value="High School Diploma"> High School Diploma </option>
                            <option value="Some College"> Some College </option>
                            <option value="College Degree"> College Degree </option>
                        </Form.Select>
                    </FloatingLabel>

                    <FloatLabel className='form-group mb-3'>
                        <MultiSelect
                            value={formData.required_skills || ''}
                            name="required_skills"
                            onChange={handleChange}
                            options={skills}
                            optionLabel="title"
                            optionValue="title"
                            className="w-full"
                        />
                        <label htmlFor="ms-benefits">Top 5 Preferred Skills</label>
                        <p className="phone_Text">This information is used to calculate the matching percentage of applied candidates based on the comparison of their skills and qualifications.</p>
                    </FloatLabel>


                    <FloatingLabel controlId="Certifications" label="Certifications" className='mb-3'>
                        <Form.Control
                            type="text"
                            placeholder=""
                            name='other_preferences'
                            value={formData.other_preferences}
                            onChange={handleChange}
                            maxLength="200"
                        />
                    </FloatingLabel>

                </div>

                <div className='jobopening_job common_card mb-3'>
                    <h1 className="d_title"> Schedule Compatibility </h1>

                    <FloatLabel className='form-group mb-3'>
                        <MultiSelect
                            value={formData?.shift_time || []}
                            name="shift_time"
                            onChange={handleChange}
                            options={shift_type}
                            optionLabel="name"
                            optionValue="code"
                            className="w-full"
                        />
                        <label htmlFor="ms-benefits">Shift Type</label>
                        {errors.shift_time && <small className='error' style={{color:'red'}} >{errors.shift_time}</small>}
                    </FloatLabel>

                    {hasOther3 &&
                        <div className='form-group mb-3'>
                            <FloatingLabel controlId="" label={<span> Other Shift <span className='required'>*</span> </span>}>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    name='other_shift_time'
                                    value={formData.other_shift_time}
                                    onChange={handleChange}
                                    maxLength="200"
                                />
                                {errors.other_shift_time && <small className='error' style={{color:'red'}} >{errors.other_shift_time}</small>}
                            </FloatingLabel>
                        </div>
                    }

                    <FloatingLabel controlId="floatingInput" label={<span>Expected Weekly Hours <span className='required'>*</span> </span>} className='mb-3'>
                        <Form.Select aria-label="Floating Default select example" name='expected_hours' value={formData.expected_hours || ''} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Fixed Hours"> Fixed Hours </option>
                            <option value="Range"> Range </option>
                        </Form.Select>
                        {errors.expected_hours && <small className='error' style={{color:'red'}} >{errors.expected_hours}</small>}
                    </FloatingLabel>
                </div>

                {/* Pay Structure: */}
                <div className='jobopening_job common_card mb-3'>

                    <h1 className="d_title"> Pay Structure </h1>

                    <FloatingLabel controlId="floatingInput" label={<span>Pay Type <span className='required'>*</span> </span>} className='mb-3'>
                        <Form.Select aria-label="Floating Default select example" name='job_pay_type' value={formData.job_pay_type || ''} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Hourly"> Hourly </option>
                            <option value="Salary"> Salary </option>
                            <option value="Commission-Based"> Commission-Based </option>
                            <option value="Other"> Other </option>
                        </Form.Select>
                        {errors.job_pay_type && <small className='error' style={{color:'red'}} >{errors.job_pay_type}</small>}
                    </FloatingLabel>

                    {formData.job_pay_type === "Other" &&
                        <div className='form-group mb-3'>
                            <FloatingLabel controlId="" label={<span>Pay Other <span className='required'>*</span> </span>}>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    name='job_pay_type_other'
                                    value={formData.job_pay_type_other}
                                    onChange={handleChange}
                                    maxLength="100"
                                />
                                {errors.job_pay_type_other && <small className='error' style={{color:'red'}} >{errors.job_pay_type_other}</small>}
                            </FloatingLabel>
                        </div>
                    }

                    <FloatingLabel controlId="floatingInput" label={<span>Pay Frequency <span className='required'>*</span> </span>} className='mb-3'>
                        <Form.Select aria-label="Floating Default select example" name='job_pay_frequency' value={formData.job_pay_frequency || ''} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Weekly"> Weekly </option>
                            <option value="Bi-weekly"> Bi-weekly </option>
                            <option value="Monthly"> Monthly </option>
                        </Form.Select>
                        {errors.job_pay_frequency && <small className='error' style={{color:'red'}} >{errors.job_pay_frequency}</small>}
                    </FloatingLabel>

                    <FloatLabel className='form-group mb-3'>
                        <MultiSelect
                            value={formData.job_benefits || ''}
                            name="job_benefits"
                            onChange={handleChange}
                            options={benefitsOption}
                            optionLabel="name"
                            optionValue ="code"
                            className="w-full"
                            showSelectAll={false}
                        />
                        <label htmlFor="ms-benefits">Benefits</label>
                        {errors.job_benefits && <small className='error' style={{color:'red'}} >{errors.job_benefits}</small>}
                    </FloatLabel>

                    {hasOther &&
                        <div className='form-group mb-3'>
                            <FloatingLabel controlId="" label={<span>Other Benefits <span className='required'>*</span> </span>}>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    name='job_benefits_other'
                                    value={formData.job_benefits_other}
                                    onChange={handleChange}
                                    maxLength="200"
                                />
                                {errors.job_benefits_other && <small className='error' style={{color:'red'}} >{errors.job_benefits_other}</small>}
                            </FloatingLabel>
                        </div>
                    }
                </div>

                {/*  */}
                <div className='jobopening_job common_card mb-3'>
                    <h1 className="d_title"> Pay Range </h1>
                    <h3 className='' style={{fontSize: '14px', marginBottom: '10px'}}> Enter minimum and maximum pay (if applicable) </h3>

                    <Row className="g-2">
                        <Col md>
                            <FloatingLabel controlId="floatingInput" label={<span>$ Min <span className='required'>*</span> </span>} className="mb-3">
                                <Form.Control type="number" name="job_min_amount" placeholder="" onChange={handleChange} value={formData.job_min_amount||''} min="1" />
                                {errors.job_min_amount && <small className='error' style={{color:'red'}} >{errors.job_min_amount}</small>}
                            </FloatingLabel>
                        </Col>
                        <Col md>
                            <FloatingLabel controlId="floatingInput" label={<span>$ Max <span className='required'>*</span> </span>} className="mb-3">
                                <Form.Control type="number"  name="job_max_amount" placeholder="" onChange={handleChange} value={formData.job_max_amount||''}  />
                                {errors.job_max_amount && <small className='error' style={{color:'red'}} >{errors.job_max_amount}</small>}
                            </FloatingLabel>
                        </Col>
                    </Row>

                    <h3 className='' style={{fontSize: '14px', marginBottom: '10px'}}> Indicate whether pay is competitive </h3>
                    <div className="custom-radio-buttons">
                        {options.map(option => (
                            <label key={option.label} className={`radio-button ${formData.pay_is_competitive === option.label ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="pay_is_competitive"
                                    value={option.label}
                                    checked={formData.pay_is_competitive === option.label}
                                    onChange={handleChange}
                                />
                                <span className="radio-button-label">{option.label}</span>
                            </label>
                        ))}
                        {errors.pay_is_competitive && <small className='error' style={{color:'red'}} >{errors.pay_is_competitive}</small>}
                    </div>
                </div>
                {/*  */}

                <div className='jobopening_job common_card mb-3'>
                    <h1 className="d_title"> Job Description </h1>
                    <FloatingLabel controlId="floatingInput" label="Description" className="">
                        <Form.Control as="textarea" name="job_description" rows={20} placeholder=""  onChange={handleChange} value={formData.job_description||''} maxLength="3000" />
                        <p className="phone_Text"> {formData.job_description.length}/3000 </p>
                        {errors.job_description && <small className='error' style={{color:'red'}} >{errors.job_description}</small>}
                    </FloatingLabel>
                </div>

                <div className='jobopening_job common_card mb-3'>
                    <h1 className="d_title"> Job Preferences </h1>
                    <h3 className='' style={{fontSize: '14px', marginBottom: '10px'}}> Candidate Preferences: </h3>

                    <FloatLabel className='form-group mb-3'>
                        <MultiSelect
                            value={formData.weekly_day_range || []}
                            name="weekly_day_range"
                            onChange={handleChange}
                            options={weekly_day_range}
                            optionLabel="name"
                            optionValue="code"
                            className="w-full"
                        />
                        <label htmlFor="ms-benefits">Weekly Day Range</label>
                        {errors.weekly_day_range && <small className='error' style={{color:'red'}} >{errors.weekly_day_range}</small>}
                    </FloatLabel>

                    {hasOther2 &&
                        <div className='form-group mb-3'>
                            <FloatingLabel controlId="" label="Other Weekly Day">
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    name='weekly_day_range_other'
                                    value={formData.weekly_day_range_other}
                                    onChange={handleChange}
                                    maxLength="200"
                                />
                                {errors.weekly_day_range_other && <small className='error' style={{color:'red'}} >{errors.weekly_day_range_other}</small>}
                            </FloatingLabel>
                        </div>
                    }

                    {formData.expected_hours === "Fixed Hours" &&
                        <div className='form-group d-flex align-items-center justify-content-between mb-3'>
                            <FloatingLabel controlId="" label="Fixed hours" style={{width: "100%"}}>
                                <Form.Control
                                    type="number"
                                    placeholder=""
                                    name='expected_min_hour'
                                    value={formData.expected_min_hour}
                                    onChange={handleChange}
                                    min="1"
                                    max="100"
                                />
                                {errors.expected_min_hour && <small className='error' style={{color:'red'}} >{errors.expected_min_hour}</small>}
                            </FloatingLabel>
                        </div>
                    }

                    {formData.expected_hours === "Range" &&
                        <div className='form-group d-flex align-items-center justify-content-between mb-3'>
                                <FloatingLabel controlId="" label="Min hours" style={{width: "48%"}}>
                                    <Form.Control
                                        type="number"
                                        placeholder=""
                                        name='expected_min_hour'
                                        value={formData.expected_min_hour}
                                        onChange={handleChange}
                                        min="1"
                                        max="100"
                                    />
                                    {errors.expected_min_hour && <small className='error' style={{color:'red'}} >{errors.expected_min_hour}</small>}
                                </FloatingLabel>
                                <span style={{width: "4%", textAlign: "center" }}>-</span>
                                <FloatingLabel controlId="" label="Max hours" style={{width: "48%"}}>
                                    <Form.Control
                                        type="number"
                                        placeholder=""
                                        name='expected_max_hour'
                                        value={formData.expected_max_hour}
                                        onChange={handleChange}
                                        min="1"
                                        max="100"
                                    />
                                    {errors.expected_max_hour && <small className='error' style={{color:'red'}} >{errors.expected_max_hour}</small>}
                                </FloatingLabel>

                        </div>
                    }

                </div>

                {/*  */}
                <div className='jobopening_job common_card mb-3'>

                    <button type="submit" onClick={handlePost} className="btn submit_btn mb-0 mt-0"> {!Id || !formData.job_status?`Next`:`Update`}  </button>

                    {/* <h1 className="d_title"> Managing </h1>

                    <button type="submit" onClick={handlePost} className="btn submit_btn mb-0"> {Id?'Change':'Post'}  </button>

                    {Id && <>
                        <button type="button" className="btn submit_btn" onClick={jobOpenClosed}> {formData.job_status?'Close':'Reopen'}   </button>
                        <button type="button" className="btn black_common_btn mb-0" onClick={()=>{setShowAlert(true)}}> Delete </button>
                    </>} */}
                </div>

            </div>
        </>
    )
}

export default PostJob;
