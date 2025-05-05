import React, {useState, useEffect} from 'react'
import Coin from '../../../assets/images/coin.png'
import Cash from '../../../assets/images/3d-cash-money.png';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { useProfile } from '../../../ProfileContext';
import PurchaseModel from '../../../BuyCreditModal'

function GuidentCounsellor() {

    const {theme} = useProfile();
    const [showModal, setShowModal] = useState(false);
    const [purchaseData, setPurchaseData] = useState({});
    const [plans, setPlans] = useState([]);
    const [User, setUser] = useState(JSON.parse(localStorage.getItem('userData'))); /* setUser */
    const ConfigData = JSON.parse(localStorage.getItem('ConfigData'));
    const TOKEN = localStorage.getItem('token');
    const history = useNavigate();

    const purchaseModule = (event) => {

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "type": "guidance_counselor"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/purchase-module`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                localStorage.setItem('userData', JSON.stringify(result.data));
                history('/personality-profile');
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error));
    }

    const getPlans = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-plans?keys=guidance_counselor,all_feature_access`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPlans(result.data);
            }
        })
        .catch((error) => console.error(error));
    }

    const purchaseModules = (event, data) => {

        event.target.disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "type": data.type,
            "id": data.id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/purchase-module`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                localStorage.setItem('userData', JSON.stringify(result.data));
                setUser(result.data);
                setShowModal(false);
                window.showToast(result.message,'success');
                history('/personality-profile');
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error));

    }

    const buyModule = (data) => {
        setPurchaseData(data);
        setShowModal(true);
    }

    useEffect(() => {
        getPlans();
    },[])

    return (
        <>
            <div className='resume_infomation_moduals guident_counsellor_page'>
                <div className='container'>
                    <div className='dcb_block'>
                        <div className="rim_content">
                            <h1 className="rim_heading">Welcome to the Guidance Counselor Test!</h1>

                            <h3 className="ul_title"> Career Exploration </h3>
                            <p className="desc">Helps students explore various career paths and understand the skills required for different professions.</p>

                            <h3 className="ul_title">  Goal Setting </h3>
                            <p className="desc"> Assists students in setting realistic and achievable career goals based on their interests, strengths, and academic performance. </p>

                            <h3 className="ul_title"> College and Job Applications </h3>
                            <ul className="">
                                <li>Provides guidance on selecting colleges, preparing applications, and navigating the admissions process.</li>
                                <li>Offers support in job searches, including resume writing, interview preparation, and job application strategies.</li>
                            </ul>

                            <h3 className="ul_title"> Skill Development </h3>
                            <p className="desc"> Encourages students to develop essential skills, such as communication, leadership, and problem-solving, that are crucial for career success. </p>

                            <h3 className="ul_title"> Resource Provision </h3>
                            <p className="desc"> Connects students with resources like internships, job shadowing opportunities, and career workshops to gain real-world experience. </p>

                        </div>

                        <div className='cover_plan_info'>

                            {
                                plans?.map((value, index) => (
                                    <div className={`lmsacc_card cover_plan_box generator_plan_box ${value.plan_key}`} key={value.plan_key}>
                                        <h2 className='lmsacc_title'> {value.plan_name} </h2>
                                        <p className='lms_desc'> {value.plan_title} </p>
                                        <p className='lms_pay_text'> <span> <img src={Coin} alt="" /> {value?.plan_price} </span> {value?.plan_price_text} </p>
                                        <div className='m-content' dangerouslySetInnerHTML={{ __html: (value.plan_description||'') }}></div>
                                        <button type='button' className='btn assecc_btn' onClick={(e) => {
                                            buyModule({
                                                type:"plan",
                                                id: value._id,
                                                name:value.plan_name,
                                                key:value.plan_key,
                                                price: value?.plan_price
                                            })
                                        }}> Get {value.plan_name} </button>
                                    </div>
                                ))
                            }

                        </div>

                        <div className="btn_block">
                           {/* {!User.guidance_counselor && <button type="button" className="btn submit_btn mb-0" onClick={handleShow}> Start  </button>} */}
                           {User.guidance_counselor && <Link to="/personality-profile" className="btn submit_btn mb-0" > Start  </Link>}
                        </div> {/* /personality-profile */}
                    </div>
                </div>
            </div>

            <PurchaseModel showModal={showModal} setShowModal={setShowModal} purchaseModules={purchaseModules} purchaseData={purchaseData} User={User}/>

        </>
    );
}

export default GuidentCounsellor;