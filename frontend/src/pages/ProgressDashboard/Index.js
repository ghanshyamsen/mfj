import React, {useState, useEffect, useRef} from "react";
import './index.css'
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import { Link } from "react-router-dom";
import ArrowOrenge from '../../assets/images/arroworenge.png'
import Cash from '../../assets/images/3d-cash-money.png';
import Cashicon from '../../assets/images/C.png';
import Coin from '../../assets/images/coin.png';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Goal from '../../assets/images/goalt.png'
import { Dropdown } from 'primereact/dropdown';
import { useProfile } from '../../ProfileContext';

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

function Index() {

    const {theme} = useProfile();

    const User = JSON.parse(localStorage.getItem('userData'));
    const TOKEN = localStorage.getItem('token');

    const [paths, setPaths] = useState([]);
    const [skills, setSkills] = useState([]);
    const [showgoal, setShowGoal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [show, setShow] = useState(false);
    const [txn, setTxn] = useState([]);
    const [credit, setCredit] = useState(0);
    const [childs, setChilds] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        reward_for:'path',
        reward_type:'credit'
    });
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [activeChild, setActiveChild] = useState(false);
    const [selectedOption, setSelectedOption] = useState("learningPath");
    const [selectedOptions, setSelectedOptions] = useState("rewards");
    const [child,  setChild] = useState({});
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState('new');
    const dropdownRef = useRef(null);
    const debounceValue = useDebounce(formData?.reward_product, 500);

    useEffect(() => {
        if(typeof formData?.reward_product === 'string'){
            getProduct()
        }
    }, [debounceValue])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchMember();
        getProduct();
    },[]);

    useEffect(() => {
        if(activeChild){
            let get_info = childs.filter(child => child._id === activeChild)?.[0];
            setChild(get_info);
            getData();
            getTxn();



            setFormData((prev) => ({
                ...prev,
                teenager: activeChild,
            }));
        }
    },[activeChild]);

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
        .finally(() => setLoadingSkeleton(false));
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
            setActiveChild(result.data?.[0]._id)
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
                            <p className="buytext"> Buy for <img src={Coin} alt=""/> <span>{option.price}</span> </p>
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
                        <p className="buytext"> Buy for <img src={Coin} alt=""/> <span>{option.price}</span> </p>
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
                handleClose();
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

    return(
        <>
            <div className="progress_dashboard_page">
                <div className="common_container">
                    <h1 className="heading"> Progress Dashboard <span> (Select the Teen) </span> </h1>

                    <div className="child_list_block">
                        <div className="clild_list">
                            <div className='child_redio_button'>
                                <div className="radio-buttons">
                                    {
                                        childs.map((value, index) => (
                                            <label className="custom-radio" key={value._id}>
                                                <input type="radio" name="teenager" value={value._id} onChange={handleChange} checked={activeChild == value._id} />
                                                <span className="radio-btn"> <img src={value.profile_image} alt="" /> {value.first_name} {value.last_name} </span>
                                            </label>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="Balance_content">
                            <img src={Coin} alt="" />
                            <p className="">{credit?.toLocaleString('en')||0} <span> Balance </span> </p>
                        </div>
                    </div>
                    {/*  */}
                    <div className="levels_block">
                        <div className="level_box">
                            <span className="level_img">
                                {child?.rank?.image && <> <img src={child?.rank?.image} alt="" /> <span className="number_text">  </span> </>}
                            </span>
                            <span className="level_name"> Rank </span>
                        </div>
                        <div className="level_box">
                            <span className="level_img"> {/* <img src={Path} alt="" /> */} <span className="number_text"> {paths?.length} </span> </span>
                            <span className="level_name"> Learning Paths </span>
                        </div>
                        <div className="level_box">
                            <span className="level_img"> {/* <img src={Skills} alt="" /> */} <span className="number_text"> {skills?.length} </span> </span>
                            <span className="level_name"> Skills </span>
                        </div>
                    </div>
                    {/*  */}
                    <div className="prodashboard_tabing">
                        <button className="btn setupgoal_btn" onClick={handleShow}> Setup Goal </button>

                        <TabView activeIndex={activeIndex}>

                            <TabPanel header="Learning Paths">
                                {paths.length > 0 ? (
                                    paths.map((value, index) => {
                                        const { path } = value;
                                        const completed = ((path?.skills?.filter(value => value.completed)?.length === path?.skills?.length)?true:false);

                                        return  (
                                            path && <div className={`learning_cards ${completed?'complete_learning_card':''}  ${index % 2 === 0?'':'problemSolving_bg'}`} key={path._id}>

                                                <div className='lc_img_block'>
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
                                                                Expiring On: {new Date(window.addDays(value.createdAt, value.expiration_period)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                                    <div className='nocard_data'>
                                        <h3> It looks like teenager haven’t started a learning path yet.</h3>
                                    </div>
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
                                                                <p className='cskill'>Expiring On: {new Date(window.addDays(value.createdAt, value.expiration_period)).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
                    </div>

                </div>
            </div>

            {/*  */}

            <Modal className={`assign_modal_code setgoal_modal ${theme}`} show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Set Goal</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                   {/*  <div className='balance_block'>
                        <div className='balance_title'> <div className='b_icon'> <img src={Cash} alt="" /> </div> <p className='mb-0'> Available Balance </p> </div>
                        <div className='total_amount'> <div className='c-icon'> <img src={Coin} alt="" /> </div> <span>  {credit} </span> </div>
                    </div> */}

                    <div className='assign_cre_from'>

                        <div className='child_redio_button'>
                            <div className="radio-buttons">
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

                        {formData?.reward_for === "path" && (
                            <FloatingLabel controlId="floatingSelectLearningPath" label={<span> Learning Path <span className='required'>*</span> </span>} className="mb-3">
                                <Form.Select aria-label="Floating label select example" name="reward_path" value={formData.reward_path||''} onChange={handleChangeForm}>
                                    <option value="">Select</option>
                                    {
                                        paths.map(({path}) => (
                                            path.skills.some(item => !item.completed) && <option value={path._id} key={path._id}>{path.title}</option>
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
                                        skills.map(({completed, skill}) => (
                                            !completed && <option value={skill._id} key={skill._id}>{skill.title}</option>
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

                        { errors.reward_product && <div className="error-message text-danger">{errors.reward_product}</div>}



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
                            <button type="button" className='btn submit_btn back-button' onClick={handleClose}> Cancel </button>
                            <button type="button" className='btn submit_btn goalbtn' onClick={setGoal}> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Buy modal */}

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

        </>
    )
}

export default Index;