import React,{useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import Cross from '../../../assets/images/fi_x.svg';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchIcon from '../../../assets/images/search.svg';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';

import CandidatesAnalytics from "../ManagerDashboard/CandidatesAnalytics";

import InfiniteScroll from 'react-infinite-scroll-component';

import backArrow from '../../../assets/images/fi_arrow-left.svg';
import resend from '../../../assets/images/resend.png';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { Tooltip } from 'primereact/tooltip';

import { TabView, TabPanel } from 'primereact/tabview';

function Candidates() {

    const {key:JobId} = useParams();
    const [candidates, setCandidates] = useState([]);
    const [savecandidates, setSaveCandidates] = useState([]);
    const [searchCandidates, setSearchCandidates] = useState('');
    const TOKEN = localStorage.getItem('token');
    const User = JSON.parse(localStorage.getItem('userData'));
    const UserId = (User.user_type==='subuser')?User.admin_id:User._id;
    const [bestmatch, setBestMatch] = useState([]);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [offsetOne, setOffsetOne] = useState(0);
    const [hasMoreOne, setHasMoreOne] = useState(true);
    const [analytics, setAnalytics] = useState({});
    const [offsetTwo, setOffsetTwo] = useState(0);
    const [hasMoreTwo, setHasMoreTwo] = useState(true);
    const [job, setJob] = useState({});
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({});

    const [shouldCallBestMatch, setShouldCallBestMatch] = useState(false);

    useEffect(() => {
        allCandidates();
        fetchCandidates();
        fetchAnalytics();
        getBestMatch();


        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-jobs/${JobId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            setJob(result.data);
        })
        .catch((error) => console.error(error));
    },[])

    const allCandidates = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?job=${JobId}&limit=50&offset=${offsetOne}`, requestOptions)
        .then((response) => response.json())
        .then((result) =>  {
            if(result.status){



                setOffsetOne(prevCount => prevCount + result.data.length);

                if(offsetOne===0){
                    setCandidates(result.data);
                }else{
                    setCandidates((prevJobs) => [...prevJobs, ...result.data]);
                }

                if(result.data.length === 0){
                    setHasMoreOne(false)
                }

            }else{
                window.showToast(result.message,"error");
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));
    }

    const fetchCandidates = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-save-candidates/${UserId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status) {
                setSaveCandidates(result.data);
            }
        })
        .catch((error) => console.error(error.message));
    }

    const handleSearchChange = (event) => {
        setSearchCandidates(event.target.value);
    };

    const handleRemove = (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-candidates/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                fetchCandidates();
            }
        })
        .catch((error) => console.error(error.message));
    }

    const getBestMatch = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);


        const raw = JSON.stringify({
            "listed":(offsetTwo > 0 ?bestmatch.map(value => value.id):[])
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };


        fetch(`${process.env.REACT_APP_API_URL}/app/get-matched-candidate/${JobId}?offset=${offsetTwo}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){

                setOffsetTwo(prevCount => prevCount + result.data.length);

                if(offsetTwo===0){
                    setBestMatch(result.data);
                }else{
                    setBestMatch((prevJobs) => [...prevJobs, ...result.data]);
                }

                if(result.data.length === 0){
                    setOffsetTwo(false)
                }

                // Reset the flag once the call is complete
                setShouldCallBestMatch(false);

            }else{
                window.showToast(result.message,"error");
            }
        })
        .catch((error) => console.error(error.message));

        if(!User.job_matched){

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                "job_matched": true
            });

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${User._id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status === 'success'){
                    localStorage.setItem('userData',JSON.stringify(result.data));
                }
            })
            .catch((error) => console.error(error.message));
        }

    }

    const filteredSaveCandidents = savecandidates.filter(value =>
        value.name.toLowerCase().includes(searchCandidates.toLowerCase())
    );

    const filteredCandidents = candidates
    .filter(value =>
      value.user_info.first_name.toLowerCase().includes(searchCandidates.toLowerCase().trim()) ||
      value.user_info.last_name.toLowerCase().includes(searchCandidates.toLowerCase().trim()) ||
      (`${value.user_info.first_name.toLowerCase()} ${value.user_info.last_name.toLowerCase()}`).includes(searchCandidates.toLowerCase().trim())
    )
    .sort((a, b) => {
      const perA = parseFloat(a.per_c) || 0; // Convert 'per_c' to a number, default to 0 if invalid
      const perB = parseFloat(b.per_c) || 0; // Convert 'per_c' to a number, default to 0 if invalid
      return perB - perA; // Descending order
    });

    const filteredMatchedCandidents = bestmatch
    .filter(value =>
      value.name.toLowerCase().includes(searchCandidates.toLowerCase().trim())
    )
    .sort((a, b) => {
      const perA = parseFloat(a.percentage) || 0; // Convert 'per_c' to a number, default to 0 if invalid
      const perB = parseFloat(b.percentage) || 0; // Convert 'per_c' to a number, default to 0 if invalid
      return perB - perA; // Descending order
    });

    const handleBack = () => {
        window.history.back();
    };

    /* Analytics */

    const fetchAnalytics = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-analytics?employer=${UserId}&job=${JobId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setAnalytics(result.data);
        })
        .catch((error) => console.error(error.message));
    }

    const jobInvited = (user, job, employer) => {

        setFormData({
            employer,
            job,
            user,
            message: ""
        });

        handleShow();
    }

    const submitInvitation = (event) => {


        if(!formData.message.trim()){
            setError("Please enter the message.");
            return
        }
        setError("");

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify(formData);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/job-invitation`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){

                handleClose();
                window.showToast(result.message, "success");
                recallBestMatch();
            }else{
                window.showToast(result.message, "error");
            }
            event.target.disabled = false;
        })
        .catch((error) => console.error(error.message));
    }

    useEffect(() => {
        if (shouldCallBestMatch && offsetTwo === 0) {
            getBestMatch();
        }
    }, [shouldCallBestMatch, offsetTwo]);

    const recallBestMatch = () => {
        setOffsetTwo(0);
        setShouldCallBestMatch(true); // Trigger the `useEffect` to call `getBestMatch`
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const isSubscribed = window.isSubscribed();

    return(
        <>
            <div className="common_background_block candidates_page">

                {/* {loadingSkeleton ? <Skeleton width="546px" height="56px" className="m-auto sk_btn mb-4"/>
                :
                <>
                    {!bestmatch && <button type="button" onClick={getBestMatch} className="btn mt-0 submit_btn match-btn"> Bring Best Matches </button>}
                    {bestmatch && <button type="button" onClick={allCandidates} className="btn mt-0 submit_btn match-btn"> All Candidates </button>}
                    </>
                } */}

                <div className="back-btn-row d-block">
                    <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span>
                    <h1 className="bbr_title">{job?.job_position}</h1>
                </div>

                <div className="common_card">
                    <div className='search_block'>

                        {loadingSkeleton ?
                            <Skeleton width="100%" height='57px'  className=""/>
                        :
                            <InputGroup className="">
                                <InputGroup.Text id="keywords">
                                    <img src={SearchIcon} alt="" />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search Candidates..."
                                    aria-label="keywords"
                                    aria-describedby="keywords"
                                    value={searchCandidates}
                                    onChange={handleSearchChange}
                                />
                            </InputGroup>
                        }
                    </div>
                </div>

                {filteredSaveCandidents.length > 0 && <div className="common_card">
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="100%" height='32px' className="mb-2"/> : "Saved candidates" } </h1>
                    <div className=''>
                        <ul className="job_list">
                            {
                                filteredSaveCandidents.map((value, index) => (
                                    loadingSkeleton ?
                                    <li key={index}>
                                        <Link>
                                            <div className="user_img"> <Skeleton shape="circle" size="100%" /> </div>
                                            <div className="info">
                                                <div className="uname mb-1"><Skeleton width="100%" /> </div>
                                                <div className='candidates-count'> <Skeleton width="100%"/></div>
                                            </div>
                                        </Link>
                                    </li>
                                    :
                                    <li key={index}>
                                        <Link to={`/candidate-info/${value.id}`}>
                                            <div className="user_img"> <img src={value.image} alt="" /> </div>
                                            <div className="info">
                                                <p className="uname">{value.name}</p>
                                                {/* <p className='candidates-count'> 32% Match rate, 5 badges</p> */}
                                            </div>
                                        </Link>
                                        <div className="close_img" onClick={(e) => {handleRemove(value.bid)}}> <img src={Cross} alt="" /> </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>}

                {/*  */}
                <div className="common_card mb-2">
                    <TabView>
                        <TabPanel header="All Applicants">
                            <div className=''>
                                <ul className="job_list b-0" id="scrollableDivOne">
                                    <InfiniteScroll
                                        dataLength={filteredCandidents.length} //This is important field to render the next data
                                        next={allCandidates}
                                        hasMore={hasMoreOne}
                                        loader={filteredCandidents.length > 0 && <h6></h6>}
                                        endMessage=""
                                        scrollableTarget="scrollableDivOne"
                                    >
                                        {
                                            filteredCandidents.length > 0 ?filteredCandidents.map((value, index) =>(
                                                loadingSkeleton ?
                                                <li key={index}>
                                                    <Link>
                                                        <div className="user_img"> <Skeleton shape="circle" size="100%" /> </div>
                                                        <div className="info">
                                                            <div className="uname mb-1"> <Skeleton width="80%" /> </div>
                                                            <div className='candidates-count'> <Skeleton width="80%" /></div>
                                                        </div>
                                                    </Link>
                                                    <Skeleton width="54px" height="24px" className="sk_btn" />
                                                </li>
                                                :
                                                <li key={index}>
                                                    <Link to={`/candidate-info/${value.candidate_id}/${JobId}`}>
                                                        {value.user_info.image && <div className="user_img"> <img src={value.user_info.image} alt="" /> </div>}
                                                        <div className="info">
                                                            <p className="uname"> {value.user_info.first_name} {value.user_info.last_name}  </p>
                                                            <p className='candidates-count'>{value.per} Match rate{value.skills && ', 5 badges'}</p>
                                                        </div>
                                                    </Link>
                                                    <div className={`status_text ${value.status.toLowerCase()}`}> {value.status == 'Invited'?'Hired':(value.status ==='Pending'?'In Review':'Not Hired')} </div>
                                                </li>
                                            )):<h6>No candidates found.</h6>
                                        }
                                    </InfiniteScroll>
                                </ul>
                            </div>
                        </TabPanel>

                        {(isSubscribed && User.plan_id.plan_matches === 'yes') && <TabPanel header="Check Your Matches ">
                            <div className=''>
                                <ul className="job_list mb-0" id="scrollableDivTwo">
                                    <InfiniteScroll
                                        dataLength={filteredMatchedCandidents.length} //This is important field to render the next data
                                        next={getBestMatch}
                                        hasMore={hasMoreTwo}
                                        loader={filteredCandidents.length > 0 && <h6></h6>}
                                        endMessage=""
                                        scrollableTarget="scrollableDivTwo"
                                    >

                                    {
                                        filteredMatchedCandidents.length > 0 ? filteredMatchedCandidents.map((value, index) => (
                                            <li key={`match_${index}`}>
                                                <Link to={`/candidate-info/${value.id}`}>
                                                    {value.logo && <div className="user_img"> <img src={value.logo} alt="" /> </div>}
                                                    <div className="info">
                                                        <p className="uname"> {value.name} </p>
                                                        <p className='candidates-count'> {value.percentage}% Match rate{value.skills && ', 5 badges'} </p>
                                                    </div>
                                                </Link>
                                                <div className="status_row">
                                                    {!value.invited && <div className="status_text invite" onClick={() => { jobInvited(value.id,JobId,UserId) }}> Invite </div>}
                                                    {value.invited && <div className="status_text invited">  Invited </div>}
                                                    {value.invited && <div className="resend" onClick={() => { jobInvited(value.id,JobId,UserId) }} data-pr-tooltip="Resend" data-pr-position="top"> <img src={resend} alt="" /> </div>}
                                                    {value.invited && <span className="invited_date"> Invited on : {value.invited_date} </span>}
                                                    <Tooltip target=".resend" />
                                                </div>
                                            </li>
                                        )):<h6>No candidates found.</h6>
                                    }

                                        {/* <li>
                                            <Link>
                                                <div className="user_img"> <img src={user} alt="" /> </div>
                                                <div className="info">
                                                    <p className="uname"> Name here </p>
                                                    <p className='candidates-count'> 80.00% Match rate, 5 badges </p>
                                                </div>
                                                <div className="status_text invited"> Invited </div>
                                                <span className="invited_date"> Invited on : 11/22/2024, 03:30 AM </span>
                                            </Link>
                                        </li> */}
                                    </InfiniteScroll>
                                </ul>
                            </div>
                        </TabPanel>}
                    </TabView>
                </div>
                {/*  */}
                {(isSubscribed && User?.plan_id && User?.plan_id?.plan_analytics === 'yes') && <CandidatesAnalytics analytics={analytics} job={JobId}/>}
            </div>

            {/* modal */}
            <Modal  show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Invite</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal_content ">
                        {/* <CountdownTimer /> */}
                        <FloatingLabel controlId="" label={<span> What to say to the candidate <span className='required'>*</span> </span>} >
                            <Form.Control as="textarea" placeholder="" style={{ height: '100px' }} value={formData.message||""} onChange={(e) => setFormData({...formData, message:e.target.value })} maxLength="500" />
                            <p className="phone_Text">{formData.message?.length}/500</p>
                            {error && <span style={{color:"red"}}>{error}</span>}
                        </FloatingLabel>
                        <button type="button" className="btn continue_btn" onClick={submitInvitation}>Submit</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );

}

export default Candidates;