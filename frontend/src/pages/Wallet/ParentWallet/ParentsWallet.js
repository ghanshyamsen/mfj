import React, {useState, useEffect} from 'react';
import Coin from '../../../assets/images/coin.png';
import Cash from '../../../assets/images/3d-cash-money.png';
import Cashicon from '../../../assets/images/C.png';

import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { useProfile } from '../../../ProfileContext';

function ParentWallet({user}) {
const {theme} = useProfile();
    const [show, setShow] = useState(false);
    const User = JSON.parse(localStorage.getItem('userData'));
    const TOKEN = localStorage.getItem('token');
    const [txn, setTxn] = useState([]);
    const [credit, setCredit] = useState(0);
    const [childs, setChilds] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({});
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);



    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchMember();
        getTxn();
    },[]);

    const getTxn = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-txn`, requestOptions)
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

        if(event.target.name ==='credits'){
            event.target.value = (event.target.value?removeDecimal(event.target.value):'');
        }

        setFormData({...formData, [event.target.name]: event.target.value});
    }

    const assignCredit = (event) => {

        event.target.disabled = true;

        const errors = {};
        if(!formData?.teenager){
            errors.teenager = "Please select teen.";
        }

        if(!formData?.credits || formData?.credits === 'e'){
            errors.credits = "Please enter the credit.";
        }else{
            if(formData.credits < 1){
                errors.credits = `Value must be greater than 0 and lower than ${credit}.`;
            }

            if(formData.credits > credit){
                errors.credits = `Your max credit limit is ${credit}, please enter an amount less than or equal to ${credit}.`;
            }

            if(credit === 0){
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
            "teenager": formData.teenager,
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
                handleClose();
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

    return (
        <>
            <div className='parent_wallet_page wallet_page'>
                <div className='wallet_container'>
                    <div className='wtop_row'>
                        <div className='btn_block'>
                            {childs.length > 0 && <button className='btn assign_credits_btn' type='button' onClick={handleShow}> Assign Credits to Teen  </button>}
                            <Link to="/packages" className='btn purchase_credits_btn'> Purchase Credits </Link>
                        </div>
                        <div className='balance_block'>
                            <div className='balance_title'>
                                <div className='b_icon'> <img src={Cash} alt="" /> </div>
                                <p className='mb-0'> Available Balance </p>
                            </div>
                            <div className='total_amount'>
                                <div className='c-icon'> <img src={Coin} alt="" /> </div>
                                <span>  {credit.toLocaleString('en')||0}  </span>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className='transaction_table_block transaction-table '>
                        <h1 className='tra_title'> All Transactions </h1>
                        <div className='transaction_table_row'>
                            {txn.length > 0 ? <ul>
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
                            loadingSkeleton ?<Skeleton  width="100%" height='20px' className='m-auto' />:
                            <div className='empty_wallet'>
                                <p className='wallet_text'> No Transactions Found </p>
                            </div>
                            }

                        </div>


                    </div>

                </div>
            </div>
            {/* asign modal */}

            <Modal className={`assign_modal_code ${theme}`}  show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Assign Credits</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='balance_block'>
                        <div className='balance_title'> <div className='b_icon'> <img src={Cash} alt="" /> </div> <p className='mb-0'> Available Balance </p> </div>
                        <div className='total_amount'> <div className='c-icon'> <img src={Coin} alt="" /> </div> <span>  {credit} </span> </div>
                    </div>
                    <div className='assign_cre_from'>
                        <div className='child_redio_button'>
                            <div className="radio-buttons">
                                {
                                    childs.map((value, index) => (
                                        <label className="custom-radio" key={value._id}>
                                            <input type="radio" name="teenager" value={value._id} onChange={handleChange} />
                                            <span className="radio-btn"> <img src={value.profile_image} alt="" /> {value.first_name} {value.last_name} </span>
                                        </label>
                                    ))
                                }
                            </div>
                            {errors.teenager && <span className="error" style={{color:'red'}}>{errors.teenager}</span>}

                        </div>


                        <FloatingLabel controlId="floatingInput" label={<span> Amount <span className='required'>*</span> </span>} className="mb-3">
                            <Form.Control type="number" placeholder="" min="1" name="credits" value={formData?.credits||''} onChange={handleChange}/>
                            {errors.credits && <span className="error">{errors.credits}</span>}
                        </FloatingLabel>

                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn back-button' onClick={handleClose}> Close </button>
                            <button type="button" className='btn submit_btn' onClick={assignCredit}> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default ParentWallet;
