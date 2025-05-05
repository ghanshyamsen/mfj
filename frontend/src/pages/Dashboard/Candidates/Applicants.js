import React,{useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchIcon from '../../../assets/images/search.svg';
import { useParams } from 'react-router-dom';

function Candidates() {

    const {key:JobId} = useParams();
    const [candidates, setCandidates] = useState([]);
    const [searchCandidates, setSearchCandidates] = useState('');
    const TOKEN = localStorage.getItem('token');
    const User = JSON.parse(localStorage.getItem('userData'));
    const UserId = (User.user_type==='subuser')?User.admin_id:User._id;

    useEffect(() => {
        allCandidates();
    },[])

    const allCandidates = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-applied-job?employer=${UserId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if(result.status){
            setCandidates(result.data)
          }
        })
        .catch((error) => console.error(error.message));

    }

    const handleSearchChange = (event) => {
        setSearchCandidates(event.target.value);
    };

    const filteredCandidents = candidates.filter(value =>
        value.user_info.first_name.toLowerCase().includes(searchCandidates.toLowerCase()) ||
        value.user_info.last_name.toLowerCase().includes(searchCandidates.toLowerCase()) ||
        value.job_info.job_position.toLowerCase().includes(searchCandidates.toLowerCase())
    );
    
    return(
        <>
            <div className="common_background_block candidates_page">

                <div className="common_card">
                    <div className='search_block'>
                        <InputGroup className="">
                            <InputGroup.Text id="keywords">
                                <img src={SearchIcon} alt="" />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search Applicants..."
                                aria-label="keywords"
                                aria-describedby="keywords"
                                value={searchCandidates}
                                onChange={handleSearchChange}
                            />
                        </InputGroup>
                    </div>
                </div>

                {/*  */}
                <div className="common_card">
                    <h1 className="d_title"> All Applicants</h1>
                    <div className=''>
                        <ul className="job_list">
                            {
                                filteredCandidents.map((value, index) =>(
                                    <li key={index}>
                                        <Link to={`/candidate-info/${value.candidate_id}/${value.job_id}`}>
                                            {value.user_info.image && <div className='user_img'>
                                                <img src={value.user_info.image} alt="" />
                                            </div>}
                                            <div className='info'>
                                                <p className="uname"> {value.user_info.first_name} {value.user_info.last_name} </p>
                                                <p className="upost"> {value.job_info.job_position} </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                </div>
                {/*  */}
            </div>
        </>
    );

}

export default Candidates;