import React, {useState, useEffect} from 'react';
import plus from '../../../assets/images/plus.svg';

import { Link } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';

import InfiniteScroll from 'react-infinite-scroll-component';

function JobOpenings() {

    const [jobs, setJobs] = useState([]);
    const [inactivejobs, setInactiveJobs] = useState([]);
    const TOKEN = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userData'));
    const userId = (user.user_type==='subuser')?user.admin_id:user._id;
    const Roles = JSON.parse(localStorage.getItem('Roles'));

    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    const [offsetOne, setOffsetOne] = useState(0);
    const [offsetTwo, setOffsetTwo] = useState(0);
    const [hasMoreOne, setHasMoreOne] = useState(true);
    const [hasMoreTwo, setHasMoreTwo] = useState(true);



    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    useEffect(() => {
        fetchActiveJobs();
        fetchInactiveJobs();
    },[])

    const fetchActiveJobs = () => {

        fetch(`${process.env.REACT_APP_API_URL}/app/get-company-jobs?active=true&user=${userId}&limit=10&offset=${offsetOne}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){

                setOffsetOne(prevCount => prevCount + result.data.length);

                if(offsetOne===0){
                    setJobs(result.data);
                }else{
                    setJobs((prevJobs) => [...prevJobs, ...result.data]);
                }

                if(result.data.length === 0){
                    setHasMoreOne(false)
                }
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }

    const fetchInactiveJobs = () => {

        fetch(`${process.env.REACT_APP_API_URL}/app/get-company-jobs?active=false&user=${userId}&limit=10&offset=${offsetTwo}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){

                setOffsetTwo(prevCount => prevCount + result.data.length);

                if(offsetTwo===0){
                    setInactiveJobs(result.data);
                }else{
                    setInactiveJobs((prevJobs) => [...prevJobs, ...result.data]);
                }

                if(result.data.length === 0){
                    setHasMoreTwo(false)
                }
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }


    return (
        <>
            <div className="common_background_block company_job_openings_page">
                <div className='jobopening_job common_card mb-3'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='32px' /> : 'Active' } </h1>
                    <div className=''>
                        <ul className="job_list" id="scrollableDivOne">
                            <InfiniteScroll
                                dataLength={jobs.length} //This is important field to render the next data
                                next={fetchActiveJobs}
                                hasMore={hasMoreOne}
                                loader={<h6>Loading...</h6>}
                                endMessage=""
                                scrollableTarget="scrollableDivOne"
                            >
                                {jobs.map((job, index)=>(
                                    loadingSkeleton ?
                                    <li key={index}>
                                        <Link to={`/job-details/${job.id}`}>
                                            <div className="info">
                                                <p className="uname mb-2"> <Skeleton width="50%" />  </p>
                                                <p className='candidates-count'> <Skeleton width="50%" /></p>
                                            </div>
                                        </Link>
                                    </li>
                                    :
                                    <li key={index}>
                                        <Link to={`/job-details/${job.id}`}>
                                            <div className="info">
                                                <p className="uname">{job.job_position}</p>
                                                <p className='candidates-count'> {job.applied_count} Candidates</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </InfiniteScroll>
                        </ul>
                    </div>

                    {((Roles?.job_posting && user.user_type==='subuser') || user.user_type!=='subuser') && <div className="post_job_btn">
                        <div className="plus_icon">
                            <Link to="/post-job"><img src={plus} alt="" /></Link>
                        </div>
                        <Link to="/post-job"> {loadingSkeleton ? <Skeleton width="50%" /> : "Post a job" } </Link>
                    </div>}
                </div>

                {/*  */}
                {inactivejobs.length > 0 && <div className='jobopening_job common_card'>
                    <h1 className="d_title"> In-Draft </h1>
                    <div className=''>
                        <ul className="job_list" id="scrollableDivTwo">
                            <InfiniteScroll
                                dataLength={inactivejobs.length} //This is important field to render the next data
                                next={fetchInactiveJobs}
                                hasMore={hasMoreTwo}
                                loader={<h6>Loading...</h6>}
                                endMessage=""
                                scrollableTarget="scrollableDivTwo"
                            >
                                {inactivejobs.map((job, index)=>(
                                    <li key={index}>
                                        <Link to={`/job-details/${job.id}`}>
                                            <div className="info">
                                                <p className="uname"> {job.job_position}  </p>
                                                <p className='candidates-count'> {job.applied_count} Candidates</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </InfiniteScroll>
                        </ul>
                    </div>
                </div>}
                {/*  */}

            </div>
        </>
    )

}

export default JobOpenings;
