import React, {useState, useEffect, useRef} from 'react';
import plus from '../../../assets/images/plus.svg';
import Create from '../../../assets/images/create.svg';
import HeartR from '../../../assets/images/HeartR.png';
import Copy from '../../../assets/images/Copy.svg';
import { Modal } from 'react-bootstrap';
import { useProfile } from '../../../ProfileContext';
import Coin from '../../../assets/images/coin.png';
import Rewards from '../../../assets/images/rewards.png';
import RewardOrders from '../../../assets/images/rewardsorder.png';
import BadgeImg from '../../../assets/images/aplication2.png';
import Rank from '../../../assets/images/rankimg.png';
import { TabView, TabPanel } from 'primereact/tabview';
import Cash from '../../../assets/images/3d-cash-money.png';
import Cashicon from '../../../assets/images/C.png';
import ArrowOrenge from '../../../assets/images/arroworenge.png'
import Goal from '../../../assets/images/goal.png'

import { ProgressBar } from 'primereact/progressbar';

import 'react-phone-number-input/style.css'

import RegistrationForm from './RegistrationForm';
import ExistingAccount from './ExistingAccount';

import userDataHook from "../../../userDataHook";

import { Link } from 'react-router-dom';

import { Skeleton } from 'primereact/skeleton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Dropdown } from 'primereact/dropdown';

function useDebounce(cb, delay) {
  const [debounceValue, setDebounceValue] = useState(cb);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(cb);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [cb, delay]);
  return debounceValue;
}

const AddYourChild = () => {

    const userData = userDataHook();
    const User = JSON.parse(localStorage.getItem('userData'));
    const TOKEN = localStorage.getItem('token');
    const dropdownRef = useRef(null);

    const {theme} = useProfile();
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showExistingModal, setShowExistingModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [paths, setPaths] = useState([]);
    const [skills, setSkills] = useState([]);
    const [txn, setTxn] = useState([]);
    const [errors, setErrors] = useState({});
    const [products, setProducts] = useState([]);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [showgoal, setShowGoal] = useState(false);
    const [show, setShow] = useState(false);
    const [credit, setCredit] = useState(0);
    const [childs, setChilds] = useState([]);
    const [activeChild, setActiveChild] = useState(false);
    const [selectedOption, setSelectedOption] = useState("learningPath");
    const [selectedOptions, setSelectedOptions] = useState("rewards");
    const [child,  setChild] = useState({});
    const [keyword, setKeyword] = useState('');
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState('new');
    const [badges, setBadges] = useState([]);
    const [assignCreditModel, setAssignCreditModel] = useState(false);

    const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);
    const [formData, setFormData] = useState({
        reward_for:'path',
        reward_type:'credit'
    });
    const [purchaseOptions, setPurchaseOptions] = useState([]);

    const debounceValue = useDebounce(formData?.reward_product, 500);

    useEffect(() => {
        if(typeof formData?.reward_product === 'string'){
            getProduct()
        }
    }, [debounceValue])

    const link = `${process.env.REACT_APP_URL}/login/${userData?userData._id:''}`;

    const handleCloseModal = () => {
        setShowModal(false);
        setShowCreateModal(false);
        setSuccessfullyRegistered(false);
        setShowExistingModal(false);
        setShowGoalModal(false)
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const handleShow = () => {
        setShowModal(true);
    }

    const handleShowExisting = () => {
        setShowExistingModal(true);
    }

    const copyToClipboard = () => {
        if (navigator.clipboard) {

            navigator.clipboard.writeText(link).then(() => {
                window.showToast("Link copied to clipboard!", 'success');
            }).catch(console.error);

        } else {

            const textArea = document.createElement('textarea');
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                window.showToast("Link copied to clipboard!", 'success');
            } catch (err) {
                window.showToast("Failed to copy link: " + err, 'error')
            }

            document.body.removeChild(textArea);

        }
    };

    const createAccountModal = () => {
        setShowModal(false);
        setShowCreateModal(true);
    };

    /*  */
    const handleSubmit = async  () => {
        setShowCreateModal(false);
        setSuccessfullyRegistered(true);
    }

    const doneRegistered = () => {
        setSuccessfullyRegistered(false);
    };

    /** Progress Dashboard */
    const handleClose = () => setShow(false);
    const handleSetGoal = () => setShowGoalModal(true);

    const getTxn = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-txn?user=${activeChild}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setTxn(result.data);
                setCredit(result.credits);
            }else{
                window.showToast(result.message,'error');
            }
        })
        .catch((error) => console.error(error.message))
        //.finally(() => setLoadingSkeleton(false));
    }

    const getData = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/my-learning?type=path&user=${activeChild}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPaths(result.data);
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));


        fetch(`${process.env.REACT_APP_API_URL}/app/my-learning?type=skill&user=${activeChild}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setSkills(result.data);
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

    }

    const fetchMember = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/teenager/get`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'success'){
                setChilds(result.data);
                setMembers(result.data);
                setActiveChild(result.data?.[0]?._id)
            }
        })
        .catch((error) => console.error(error.message));
    }

    function removeDecimal(num) {
        if (typeof num === 'number' || typeof num === 'string') {
            return Math.floor(num);
        } else {
            return num;
        }
    }

    const handleChange = (event) => {
        setActiveChild(event.target.value);
    }

    const handleChangeForm = (event) => {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));

        setErrors({});
    }

    const getProduct = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-products?keyword=${formData?.reward_product||''}&limit=${limit}&offset=0&category=&sort=${sort}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setProducts(result.data);
            }
        })
        .catch((error) => console.error(error));
    }

    const selectedTemplate = (option, props) => {
        if (option) {
            return (
                <div className="d-flex align-items-center">
                    <img alt={option.title} src={option.image} className={`mr-2 flag`} style={{ width: '18px' }} />
                    <div  className="opbox">
                        <p className="optitle"> {option.title} </p>
                        <div className="d-sm-flex align-items-center justify-content-between">
                            <p className="category_text"> {option.category} </p>
                            <p className="buytext"> Buy for <img src={Coin} alt="" /> <span>{option.price}</span> </p>
                        </div>
                    </div>
                </div>
            )
        }

        return <span>{props.placeholder}</span>;
    };

    const OptionTemplate = (option) => {
        return (
            <div className="d-flex align-items-center">
                <img alt={option.title} src={option.image} className={`mr-2 flag`} style={{ width: '18px' }} />
                <div  className="opbox">
                    <p className="optitle"> {option.title} </p>
                    <div className="d-sm-flex align-items-center justify-content-between">
                        <p className="category_text"> {option.category} </p>
                        <p className="buytext"> Buy for <img src={Coin} alt="" /> <span>{option.price}</span> </p>
                    </div>
                </div>
            </div>
        )
    };

    const setGoal = (event) => {


        event.target.disabled = true;

        const errors = {};
        if(!formData?.teenager){
            errors.teenager = "Please select teen.";
        }

        if(formData.reward_for === 'skill' && !formData?.reward_skill){
            errors.reward_for = "Please select your skill.";
        }

        if(formData.reward_for === 'path' && !formData?.reward_path){
            errors.reward_for = "Please select your path.";
        }

        if(formData.reward_for === 'level' && !formData?.reward_level){
            errors.reward_for = "Please select your level.";
        }

        if(formData.reward_type === 'credit'){
            if(!formData?.reward_credit || formData?.reward_credit === 'e'){
                errors.reward_credit = "Please enter the credit.";
            }else{
                if(formData.reward_credit < 1){
                    errors.reward_credit = `Value must be greater than 0 and lower than ${credit}.`;
                }

                if(formData.reward_credit > User.user_credit){
                    errors.reward_credit = `Your max credit limit is ${User.user_credit}, please enter an amount less than or equal to ${User.user_credit}.`;
                }

                if(User.user_credit === 0){
                    errors.reward_credit = `You have insufficient credits.`;
                }
            }
        }else{
            if(!formData?.reward_product){
                errors.reward_product = "Please select the product.";
            }else{

                if(formData?.reward_product?.price > User.user_credit){
                    errors.reward_product = `Your max credit limit is ${User.user_credit}, please select product less than or equal to ${User.user_credit}.`;
                }

                if(User.user_credit === 0){
                    errors.reward_product = `You have insufficient credits.`;
                }
            }
        }

        if(Object.keys(errors).length > 0){
            setErrors(errors);
            event.target.disabled = false;
            return
        }
        setErrors(errors);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);


        const raw = JSON.stringify({...{"type":"set_goal"}, ...formData});

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
                setCredit(result.credit);
                setShowGoalModal(false);
                setFormData({
                    reward_for:'path',
                    reward_type:'credit'
                });
                window.showToast(result.message,'success');
                event.target.disabled = false;
                setShowGoal(true);
            }else{
                window.showToast(result.message,'error');
                event.target.disabled = false;
            }
        })
        .catch((error) => console.error(error));
    }

    const handleFocus = () => {
        if (dropdownRef.current && dropdownRef.current.show) {
            dropdownRef.current.show(); // Programmatically open the dropdown
        }
    };

    const getpurchasedModule = (Id) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-purchased-modules/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPurchaseOptions(result.data);
            }
        })
        .catch((error) => console.error(error.message));
    }

    useEffect(() => {
        fetchMember();
        getProduct();
    },[]);

    useEffect(() => {
        if(activeChild){
            setLoadingSkeleton(true);
            let get_info = childs.filter(child => child._id === activeChild)?.[0];

            setChild(get_info);
            getData();
            getTxn();
            getpurchasedModule(activeChild);
            getEarnBadge(activeChild);

            setFormData((prev) => ({
                ...prev,
                teenager: activeChild,
            }));
        }else{
            setLoadingSkeleton(false)
        }
    },[activeChild]);

    const getEarnBadge = (Id) => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-badges/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setBadges(result.data);
            }
        })
        .catch((error) => console.error(error.message));
    }

    const assignCredit = (event) => {

        event.target.disabled = true;

        const errors = {};

        if(!formData?.credits || formData?.credits === 'e'){
            errors.credits = "Please enter the credit.";
        }else{
            if(formData.credits < 1){
                errors.credits = `Value must be greater than 0 and lower than ${User?.user_credit?.toLocaleString('en')}.`;
            }

            if(formData.credits > User?.user_credit){
                errors.credits = `Your max credit limit is ${User?.user_credit?.toLocaleString('en')}, please enter an amount less than or equal to ${User?.user_credit?.toLocaleString('en')}.`;
            }

            if(User?.user_credit === 0){
                errors.credits = `You have insufficient credits.`;
            }
        }

        if(Object.keys(errors).length > 0){
            setErrors(errors);
            event.target.disabled = false;
            return
        }
        setErrors(errors);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "teenager": activeChild,
            "credits": formData.credits
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/assign-credits`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if(response.status){
                setAssignCreditModel(false);
                setFormData({
                    ...formData,
                    teenager:"",
                    credits:""
                });
                getTxn();
                window.showToast(response.message,'success');
                event.target.disabled = false;
            }else{
                window.showToast(response.message,'error');
            }
        })
        .catch((error) => console.error(error.message));
    }

    function removeDecimal(num) {
        if (typeof num === 'number' || typeof num === 'string') {
            return Math.floor(num);
        } else {
            return num;
        }
    }

    const handleChangeCredit = (event) => {

        if(event.target.name ==='credits'){
            event.target.value = (event.target.value?removeDecimal(event.target.value):'');
        }

        setFormData({...formData, [event.target.name]: event.target.value});
    }


  return (
    <>
        <div className="parent_dashboard_page ">

            <div className='dashboard_content_block'>
            <div className='dcb_left_side_content'>
                <div className='teenProgress_block'>
                    <div className='tp_heading_row'>
                    {loadingSkeleton ? <Skeleton width="30%" height='24px' /> : <h2 className='tp_title'> Progress of your Teen </h2> }
                    {loadingSkeleton ?
                        <Skeleton width="30%" height='45px' borderRadius='12px' />
                        :
                        <FloatingLabel controlId="floatingSelectLearningPath" className="">
                            <Form.Select aria-label="Floating label select example" name="teenager" value={activeChild} onChange={handleChange}>
                                {
                                    childs.map((value, index) => (
                                        <option value={value._id} key={value._id}>{value.first_name} {value.last_name} </option>
                                    ))
                                }
                            </Form.Select>
                        </FloatingLabel>
                    }
                    </div>

                    {/*  */}
                    <div className='tp_body_block'>

                    {loadingSkeleton ?
                        <div className='tp_btn_row'>
                            <Skeleton width="13%" height='26px' />
                            <Skeleton width="13.5%" height='34px' borderRadius='30px' className='ms-3' />
                            <Skeleton width="13.5%" height='34px' borderRadius='30px' className='ms-3' />
                            <Skeleton width="13.5%" height='34px' borderRadius='30px' className='ms-3' />
                        </div>:
                        <div className='tp_btn_row'>
                            <p className='my_balance mb-0'> <img src={Coin} alt="" /> {child?.user_credit?.toLocaleString('en')||0} Balance </p>
                            <button type='button' className='goal_btn btn' onClick={handleSetGoal}> Set Goal </button>
                            <button type='button' className='assign_btn btn' onClick={() => setAssignCreditModel(true)}> Assign Credits </button>
                            <Link to={`/member-info/${activeChild}`} className='view_profile_btn btn'> View Profile </Link>
                        </div>
                    }

                    {/*  */}
                    {badges?.length > 0 && <div className='badges_earned_block'>
                        {loadingSkeleton ? <Skeleton width="120px" height='15px' className='m-auto mb-1' /> : <h3 className='badges_title'> Badges Earned </h3> }
                        {loadingSkeleton ?
                            <ul className='badge_list'>
                                {
                                    badges?.map((value, index) => (
                                        <li key={value._id}>
                                            <div className='badge_icon'> <Skeleton width="100%" height='100%'/> </div>
                                            <h2 className='badge_name'> <Skeleton width="100%" height='15px'/>  </h2>
                                        </li>
                                    ))
                                }
                            </ul>:
                            <ul className="badge_list">
                                {
                                    badges?.map((value, index) => (
                                        <li key={value._id}>
                                            <div className="badge_icon"> <img src={value?.badge_image} alt="" />  </div>
                                            <h2 className="badge_name"> {value?.badge_name} </h2>
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                    </div>}

                    {/*  */}
                    <div className='tp_jobs_information'>

                        <div className="levels_block">
                            <div className="level_box">
                                {loadingSkeleton ? <Skeleton width="25px" height='30px' className='m-auto mb-1' /> : <span className="level_img">
                                    {child?.rank?.image && <img src={child?.rank?.image} alt="" />}

                                </span> }
                                {loadingSkeleton ? <Skeleton width="33px" height='17px' className='m-auto' /> : <span className="level_name"> Rank </span> }
                            </div>
                            <div className="level_box">
                                {loadingSkeleton ? <Skeleton width="25px" height='30px' className='m-auto mb-1' /> : <span className="level_img"> <span className="number_text"> {paths?.length} </span> </span> }
                                {loadingSkeleton ? <Skeleton width="33px" height='17px' className='m-auto' /> : <span className="level_name"> Learning Paths </span> }
                            </div>
                            <div className="level_box">
                                {loadingSkeleton ? <Skeleton width="25px" height='30px' className='m-auto mb-1' /> :<span className="level_img"> <span className="number_text"> {skills?.length} </span> </span> }
                                {loadingSkeleton ? <Skeleton width="33px" height='17px' className='m-auto' /> : <span className="level_name"> Skills </span> }
                            </div>
                        </div>

                        {/*  */}
                        <div className='applied_jobs_block'>
                            {loadingSkeleton ? <Skeleton width="33px" height='21px' className='m-auto' /> : <span> {purchaseOptions?.appliedcount||0} </span> }
                            {loadingSkeleton ? <Skeleton width="130px" height='21px' className='m-auto' /> : <span> Jobs Applied </span> }
                        </div>
                        {child?.current_level && <div className='current_level_block'>
                            {loadingSkeleton ? <Skeleton width="70%" height='21px' /> : <span> {child?.current_level?.name} </span> }
                        </div>}
                    </div>

                    {/*  */}
                    <div className="prodashboard_tabing">

                        <TabView activeIndex={activeIndex}>

                            <TabPanel header="Learning Paths">
                                {paths.length > 0 ? (
                                    paths.map((value, index) => {
                                        const { path } = value;
                                        const completed = ((path?.skills?.filter(value => value.completed)?.length === path?.skills?.length)?true:false);

                                        return  (
                                            path && <div className={`learning_cards ${completed?'complete_learning_card':''}  ${index % 2 === 0?'':'problemSolving_bg'}`} key={path._id}>

                                                <div className='lc_img_block'>
                                                    <div className='bagde_name'> {path.level} </div>
                                                    <h1 className='lc_img_title'>
                                                        {path.title}
                                                    </h1>
                                                    <div className='lc_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/path/${path.badge}`} alt="" /> </div>
                                                    {completed && <div className='lc_badge_earn'> <span> Badge Earned </span></div>}
                                                </div>

                                                <div className='lc_content_block'>
                                                    <h3 className='lccb_title'> {path.title} </h3>
                                                    <div className='lccb_rating_block'>
                                                        <div className='lccb_left'>

                                                            <p className='cskill'>
                                                                Completed Skill <span>{path.skills?.filter(value => value.completed)?.length} of {path.skills?.length}</span> of the Leadership Path.
                                                                <br/>
                                                                {/* Expiring On: {new Date(window.addDays(value.createdAt, value.expiration_period)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} */}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='progressBar_block'>
                                                        <ProgressBar value={(path.skills?.filter(value => value.completed)?.length/path.skills?.length)*100}></ProgressBar>
                                                        <div className='progress_value'>
                                                            <span> Overall Progress </span>
                                                            <span> {((path.skills?.filter(value => value.completed)?.length/path.skills?.length)*100).toFixed(2)}% </span>
                                                        </div>
                                                    </div>

                                                    <div className='skills_list_block'>

                                                        {
                                                            path?.skills?.map((value, index) => (
                                                                <div className={`skill_list ${value?.completed?'complete_skill':''}`} key={value._id}>
                                                                    <div className='list_item'>
                                                                        <div className='list_left_block'>
                                                                            <div className='skill_icon'> <img src={ArrowOrenge} alt=""/> </div>
                                                                            <div className='skill_content'>
                                                                                <h3 className='skill_name'> {value.title} </h3>
                                                                                {value?.completed && <p className='sbuy'> Congratulations, you have passed {value.title}! </p>}
                                                                            </div>
                                                                        </div>
                                                                        <div className='list_right_block'>
                                                                            <div className='sbadge_icon'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${value.skill_badge}`} alt="" /> </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }

                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    })

                                ) : (
                                    <>
                                        {
                                            loadingSkeleton ?
                                            <Skeleton width="200px" height='30px' className='m-auto mb-1' />:
                                            <div className='nocard_data'>
                                                <h3> It looks like teenager haven’t started a learning path yet.</h3>
                                            </div>
                                        }
                                    </>
                                )}

                            </TabPanel>

                            <TabPanel header="Skills">
                                <div className='skill_card_block'>
                                    {skills.length > 0 ? (
                                        skills.map((value, index) => {

                                            const { skill } = value;

                                            return (
                                                skill &&
                                                <div className={`skills_card ${value?.completed?'complete_skills_card':''}`} key={skill._id}>

                                                    <div className='skill_type_block'>
                                                        <div className="skill_type">
                                                            <div className='skill_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${skill.skill_logo}`} alt="" /> </div>
                                                            <div>
                                                                <div className='skill_name'> {skill.title} </div>
                                                                {/* <p className='cskill'>Expiring On: {new Date(window.addDays(value.createdAt, value.expiration_period)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p> */}
                                                            </div>
                                                        </div>
                                                        <div className='progressBar_block'>
                                                            <ProgressBar value={value?.total_chapters_count?(((value.completed_count/value.total_chapters_count)*100)):0}></ProgressBar>
                                                            <div className='progress_value'>
                                                                <span> Overall Progress </span>
                                                                <span> {value?.total_chapters_count?(((value.completed_count/value.total_chapters_count)*100).toFixed(2)):0}% </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/*  */}
                                                    <div className='skill_process_block'>
                                                        <div className='badge_img_block'>
                                                            <div className='badge_img'> <img src={`${process.env.REACT_APP_MEDIA_URL}lms/skills/${skill.skill_badge}`} alt="" /> </div>
                                                        </div>
                                                        <div className=''>
                                                            {skill?.path.length > 0 && <span className='path_text'> {skill?.path?.map(({title}) => title).join(', ')} </span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className='nocard_data'>
                                            <h3> It looks like teenager haven’t added any skills yet. </h3>
                                        </div>
                                    )}
                                </div>
                            </TabPanel>

                            <TabPanel header="Transaction History">
                                <div className="transaction_table_block p-0">
                                    <div className='transaction_table_row'>
                                        {txn.length > 0 ?
                                            <ul>
                                                {txn.map((value, index) => (
                                                    <li key={index} className={`transaction-item ${value.type.toLowerCase()}`}>
                                                        <div className='tdate_icon-block'>
                                                            <div className="transaction-icon">
                                                                <img src={Cash} alt="User Icon" />
                                                            </div>
                                                            <div className="transaction-date">{new Date(value.createdAt).toLocaleDateString('en-US', { day: 'numeric',month: 'long', year: 'numeric',hour: 'numeric', minute: 'numeric',second: 'numeric' })}</div>
                                                        </div>

                                                        <div className="transaction-description">{value.description}</div>
                                                        <div className="transaction-amount"><span className='tr_amount'> {value.type==='debit'?'-':'+'} <img src={Cashicon} alt="" /> {value.credit.toLocaleString('en')}</span></div>
                                                        <div className="transaction-type "> <span className='type-badge'>{value.type.toUpperCase()}</span> </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            :
                                            <div className='empty_wallet'>
                                                <p className='wallet_text'> No Transactions Found </p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </TabPanel>

                        </TabView>

                        {/* <button type='button' className='btn full_detail_btn'> View Full Detail </button> */}
                    </div>

                    </div>
                </div>
            </div>


            <div className='dcb_right_side_content'>
                <div className='dcbrsc_block avai_balance_block'>
                {loadingSkeleton ? <Skeleton width="80%" height='24px' className='mb-2' /> : <h2 className='av_title'> Available Balance </h2> }
                <div className='d-flex align-items-center justify-content-between'>
                    {loadingSkeleton ? <Skeleton width="87px" height='26px' /> : <p className='mb-0 my_coin'> <img src={Coin} alt="" /> {User?.user_credit?.toLocaleString('en')} </p> }
                    {loadingSkeleton ? <Skeleton width="87px" height='26px' /> : <Link to="/packages" className='btn new_common_btn'> Purchase Credits </Link> }
                </div>
                </div>

                <div className='chlid_block add_child_block'>
                    <h1 className="d_title"> {loadingSkeleton ? <Skeleton width="50%" height='20px' /> : 'Add your child' } </h1>
                    {loadingSkeleton ? <Skeleton width="50%" className='mb-3' />:<p className="sub_text"></p>}

                    <div className="add_Child_btn" onClick={handleShowExisting} >
                    <div className="plus_icon"> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={plus} alt="" /> } </div>
                    {loadingSkeleton ? <Skeleton width="50%" className='ms-2' />
                    :
                    <span>Add existing account </span>
                    }
                    </div>
                    <div className="add_Child_btn" onClick={handleShow}>
                    <div className="plus_icon"> {loadingSkeleton ? <Skeleton width="20px" height='20px' /> : <img src={Create} alt="" /> } </div>
                    {loadingSkeleton ? <Skeleton width="50%" className='ms-2' />
                    :
                        <span>Create account </span>
                    }
                    </div>
                </div>

                <div className='chlid_block'>
                    <h1 className="d_title text-center"> {loadingSkeleton ? <Skeleton width="50%" height='32px' className='m-auto mb-2' /> : 'Family members' } </h1>
                    <ul className='application_list'>
                    {members.map((member, index) => (
                        <li key={index}>
                        {loadingSkeleton ? (
                            <Link>
                            <div className="user_img">
                                <Skeleton shape="circle" size="100%" />
                            </div>
                            <div className="info">
                                <div className="uname">
                                <Skeleton width="50%" height="20px" className="mb-1" />
                                </div>
                                <div className="upost">
                                <Skeleton width="50%" />
                                </div>
                            </div>
                            </Link>
                        ) : (
                            <Link to={`/member-info/${member._id}`}>
                                <div className="user_img">
                                    <img src={member.profile_image} alt={`${member.first_name} ${member.last_name}`} />
                                </div>
                                <div className="info">
                                    <p className="uname">{`${member.first_name} ${member.last_name}`}</p>
                                    {/* <p className="upost"> Was online 8 minutes ago </p> */}
                                </div>
                            </Link>
                        )}
                        </li>
                    ))}
                    </ul>
                </div>

                <div className='rewards_links_block pt-0'>
                <div className='reward_box'>
                    {loadingSkeleton ?
                        <div className='d-flex'><Skeleton width="24px" height='24px' className='me-1 mb-3' /> <Skeleton width="70%" height='26px' /></div> :
                        <p className='reward_title'> <img src={Rewards} alt="copy" /> Reward Store </p>
                    }
                    {loadingSkeleton ? <Skeleton width="120px" height='33px' borderRadius="50px" /> : <Link to="/products" className='btn new_common_btn'> View Store </Link> }
                </div>
                <div className='reward_box'>
                    {loadingSkeleton ?
                        <div className='d-flex'> <Skeleton width="24px" height='24px' className='me-1 mb-3' /> <Skeleton width="80%" height='26px' /> </div> :
                        <p className='reward_title'> <img src={RewardOrders} alt="copy" /> Reward Orders </p>
                    }
                    {loadingSkeleton ? <Skeleton width="120px" height='33px' borderRadius="50px" /> :  <Link to="/product-orders" className='btn new_common_btn'> View Orders </Link> }
                </div>
                </div>

            </div>

            </div>
        </div>

        <Modal className={`child_modal ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
            <div className='icons'>
            <img src={HeartR} alt="" />
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className='modal_content'>
            <h1 className='heading'>Add your child</h1>
            <p className=''>When they accept your invitation, you will be able to track their platform statistics</p>
            <button className={`btn continue_btn share_icon ${isVisible ? 'active' : ''}`} onClick={toggleVisibility}>Share link</button>

            <div className='text-center create_child' style={{cursor:"pointer"}}><span className='create_text' onClick={createAccountModal}>Create account </span></div>

            {isVisible && (
                <div className="share_link_box">
                <div className="share_link_content">
                    <p className="link_title"> Share this link to invite your child </p>
                    <p className="link"> {link} </p>
                </div>
                <button className="copy_btn" type="button" onClick={copyToClipboard}> <img src={Copy} alt="" /> </button>
                </div>
            )}
            </div>

        </Modal.Body>
        </Modal>

        {/*  */}
        <Modal className={`child_register_modal ${theme}`} show={showCreateModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <div className='register_form'>
                <form>
                    <RegistrationForm closeModal={handleCloseModal} successRegistered={()=>{setSuccessfullyRegistered(true)}} fetchMember={fetchMember} />
                </form>
            </div>
        </Modal.Body>
        </Modal>

        {/*  */}
        <Modal className={`child_modal ${theme}`} show={successfullyRegistered} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
            <div className='icons'>
            <img src={HeartR} alt="" />
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className='modal_content'>
            <h1 className='heading'>You have successfully registered your child's account</h1>
            <p className=''>Now they can log in</p>
            <button className="btn continue_btn share_icon" onClick={doneRegistered}>Done</button>
            </div>
        </Modal.Body>
        </Modal>

        {/*  */}
        <Modal className={`child_register_modal ${theme}`} show={showExistingModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <div className='register_form'>
                <form>
                    <ExistingAccount closeModal={handleCloseModal} fetchMember={fetchMember}/>
                </form>
            </div>
        </Modal.Body>
        </Modal>

        {/*  */}
        <Modal className={`assign_modal_code setgoal_modal ${theme}`} show={showGoalModal} onHide={handleCloseModal} backdrop="static">
            <Modal.Header closeButton>
            <Modal.Title>Set Goal</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div className='child_redio_button setgoal_button'>
                    <div className="radio-buttons">
                    <label className="custom-radio text-center">
                            <input
                                type="radio"
                                name="reward_for"
                                value="level"
                                checked={formData?.reward_for === "level"}
                                onChange={handleChangeForm}
                            />
                            <span className="radio-btn"> Level </span>
                        </label>
                        <label className="custom-radio text-center">
                            <input
                                type="radio"
                                name="reward_for"
                                value="path"
                                checked={formData?.reward_for === "path"}
                                onChange={handleChangeForm}
                            />
                            <span className="radio-btn">Learning Path</span>
                        </label>
                        <label className="custom-radio text-center">
                            <input
                                type="radio"
                                name="reward_for"
                                value="skill"
                                checked={formData?.reward_for === "skill"}
                                onChange={handleChangeForm}
                            />
                            <span className="radio-btn">Skills</span>
                        </label>
                    </div>
                </div>

                <div className='assign_cre_from'>

                {formData?.reward_for === "level" && (
                        <FloatingLabel controlId="floatingSelectLearningPath" label={<span> Levels <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Select aria-label="Floating label select example" name="reward_level" value={formData.reward_level||''} onChange={handleChangeForm}>
                                <option value="">Select</option>
                                {
                                    purchaseOptions?.levels?.map((level) => (
                                        <option value={level._id} key={level._id}>{level.name}</option>
                                    ))
                                }
                            </Form.Select>
                            {errors.reward_for && <div className="error-message text-danger">{errors.reward_for}</div>}
                        </FloatingLabel>
                    )}

                    {formData?.reward_for === "path" && (
                        <FloatingLabel controlId="floatingSelectLearningPath" label={<span> Learning Path <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Select aria-label="Floating label select example" name="reward_path" value={formData.reward_path||''} onChange={handleChangeForm}>
                                <option value="">Select</option>
                                {
                                    purchaseOptions?.paths?.map((path) => (
                                    <option value={path._id} key={path._id}>{path.title}</option>
                                    ))
                                }
                            </Form.Select>
                            {errors.reward_for && <div className="error-message text-danger">{errors.reward_for}</div>}
                        </FloatingLabel>
                    )}

                    {formData?.reward_for === "skill" && (
                        <FloatingLabel controlId="floatingSelectSkills" label={<span> Skills <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Select aria-label="Floating label select example" name="reward_skill" value={formData.reward_skill||''} onChange={handleChangeForm}>
                                <option>Select</option>
                                {
                                purchaseOptions?.skills?.map((skill) => (
                                    <option value={skill._id} key={skill._id}>{skill.title}</option>
                                ))
                                }
                            </Form.Select>
                            {errors.reward_for && <div className="error-message text-danger">{errors.reward_for}</div>}
                        </FloatingLabel>
                    )}

                    <div className='child_redio_button mt-2'>
                        <div className="radio-buttons">
                            <label className="custom-radio text-center">
                                <input
                                    type="radio"
                                    name="reward_type"
                                    value="credit"
                                    checked={formData?.reward_type === "credit"}
                                    onChange={handleChangeForm}
                                />
                                <span className="radio-btn">Rewards</span>
                            </label>
                            <label className="custom-radio text-center">
                                <input
                                    type="radio"
                                    name="reward_type"
                                    value="product"
                                    checked={formData?.reward_type === "product"}
                                    onChange={handleChangeForm}
                                />
                                <span className="radio-btn">Product</span>
                            </label>
                        </div>
                    </div>

                    {formData?.reward_type === "credit" && (
                        <FloatingLabel controlId="floatingInput" label={<span> Rewards <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Control type="text" placeholder="" name="reward_credit" value={formData.reward_credit||''} onChange={handleChangeForm} />
                            {errors.reward_credit && <div className="error-message text-danger">{errors.reward_credit}</div>}
                        </FloatingLabel>
                    )}


                    {formData?.reward_type === "product" && (

                        <Dropdown value={formData.reward_product||''}
                            onChange={handleChangeForm} options={products||[]}
                            valueTemplate={selectedTemplate}
                            itemTemplate={OptionTemplate}
                            optionLabel="title"
                            optionValue="id"
                            editable
                            placeholder="Search or Select a Product"
                            className="w-full md:w-14rem"
                            name="reward_product"
                            ref={dropdownRef}
                            onFocus={handleFocus} // Open dropdown when input is focused
                        />
                    )}
                    {errors.reward_product && <div className="error-message text-danger">{errors.reward_product}</div>}

                    {((formData?.reward_type === 'credit' &&  (formData.reward_credit||0) > User.user_credit) || (formData?.reward_type === 'product' &&  (formData?.reward_product?.price||0) > User.user_credit)) &&  (
                        <>
                            <div className='balance_block mt-3'>
                                <div className='balance_title'> <div className='b_icon'> <img src={Cash} alt="" /> </div> <p className='mb-0'> Available Balance </p> </div>
                                <div className='total_amount'> <div className='c-icon'> <img src={Coin} alt="" /> </div> <span>  {User.user_credit?.toLocaleString('en')||0} </span> </div>
                            </div>

                            <div className='add_credits_block'>
                                <p className='mb-0'> Your Available Balance is low, please add credits </p>
                                <Link to="/packages" className='btn add_credit_btn' type='button'> Add Credits </Link>
                            </div>
                        </>
                    )}

                    <div className='btn_block'>
                        <button type="button" className='btn submit_btn back-button' onClick={handleCloseModal}> Cancel </button>
                        <button type="button" className='btn submit_btn goalbtn' onClick={setGoal}> Submit </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

        <Modal className={`assign_modal_code ${theme}`} show={showgoal} onHide={() => {setShowGoal(false)}}>
            <Modal.Header closeButton>
                <div className='icons'>
                    <img src={Goal} alt="" />
                </div>
                <Modal.Title> </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div className='buy_block'>
                    <h3 className=''>Goal has been successfully set up. </h3>
                    <p className="">Appreciated your effective method of setting goals for your teenager.</p>

                    <div className='btn_block'>
                        <button type="button" className='btn submit_btn m-0' onClick={() => {setShowGoal(false)}}> Close </button>
                    </div>

                </div>
            </Modal.Body>
        </Modal>

        <Modal className={`assign_modal_code ${theme}`}  show={assignCreditModel} onHide={()=> setAssignCreditModel(false)} backdrop="static">
            <Modal.Header closeButton>
            <Modal.Title>Assign Credits</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='balance_block'>
                    <div className='balance_title'> <div className='b_icon'> <img src={Cash} alt="" /> </div> <p className='mb-0'> Available Balance </p> </div>
                    <div className='total_amount'> <div className='c-icon'> <img src={Coin} alt="" /> </div> <span>  {User.user_credit?.toLocaleString('en')||0} </span> </div>
                </div>
                <div className='assign_cre_from'>

                    <FloatingLabel controlId="floatingInput" label={<span> Amount <span className='required'>*</span> </span>} className="mb-3">
                        <Form.Control type="number" placeholder="" min="1" name="credits" value={formData?.credits||''} onChange={handleChangeCredit}/>
                        {errors.credits && <span className="error">{errors.credits}</span>}
                    </FloatingLabel>

                    <div className='btn_block'>
                        <button type="button" className='btn submit_btn back-button' onClick={()=> setAssignCreditModel(false)}> Close </button>
                        <button type="button" className='btn submit_btn' onClick={assignCredit}> Submit </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </>
  );
};

export default AddYourChild;
