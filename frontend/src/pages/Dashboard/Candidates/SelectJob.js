import React, {useState, useEffect}  from "react";
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchIcon from '../../../assets/images/search.svg';

import { Skeleton } from 'primereact/skeleton';

function SelectJob() {

    const [jobs, setJobs] = useState([]);
    const [searchJob, setSearchJob] = useState('');
    const TOKEN = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userData'));
    const userId = (user.user_type==='subuser')?user.admin_id:user._id;

    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-company-jobs?active=true&user=${userId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setJobs(result.data);
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

    },[])

    const handleSearchChange = (event) => {
        setSearchJob(event.target.value);
    };

    const filteredJobs = jobs.filter(job =>
        job.job_position.toLowerCase().includes(searchJob.toLowerCase())
    );


    return(
        <>
            <div className="common_background_block candidates_page">

                <div className="common_card">
                    <div className='search_block'>
                        {loadingSkeleton ?
                            <Skeleton width="100%" height='57px'  className="mb-3"/>
                            :
                            <InputGroup className="">
                                <InputGroup.Text id="keywords">
                                    <img src={SearchIcon} alt="" />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search Job..."
                                    aria-label="keywords"
                                    aria-describedby="keywords"
                                    value={searchJob}
                                    onChange={handleSearchChange}
                                />
                            </InputGroup>
                        }
                    </div>
                </div>

                <div className="dashboard_content_block common_card">
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height="32px" className="mb-3"/> : 'Select job' } </h1>
                    <div className=''>
                        <ul className="job_list">
                            {filteredJobs.map((job, index)=>(
                                loadingSkeleton ?
                                <li key={index}>
                                    <Link>
                                        <div className="info">
                                            <div className="uname"> <Skeleton width="50%"/> </div>
                                            <div className='candidates-count'> <Skeleton width="50%"/> </div>
                                        </div>
                                    </Link>
                                </li>
                                :
                                <li key={index}>
                                    <Link to={`/candidates/${job.id}`}>
                                        <div className="info">
                                            <p className="uname"> {job.job_position}  </p>
                                            <p className='candidates-count'> {job.applied_count} Candidates</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );

}

export default SelectJob;