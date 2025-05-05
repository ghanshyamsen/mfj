import React from "react";
import Coin from './assets/images/coin.png'
import Cash from './assets/images/3d-cash-money.png';
import Modal from 'react-bootstrap/Modal';
import { useProfile } from './ProfileContext';
import { Link } from 'react-router-dom';

const BuyCreditModal = ({showModal, setShowModal, purchaseModules, purchaseData, User}) => {

    const {theme} = useProfile();

    return(
        <>
            <Modal className={`assign_modal_code ${theme}`} show={showModal} onHide={() => { setShowModal(false) }} backdrop="static">

                <Modal.Header closeButton>
                    <Modal.Title> {purchaseData.name}  </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className='buy_block'>

                        <div className='credits_amount'>
                            <label> Credits Required </label>
                            <div className='ca_cash'> <img src={Coin} alt=""/> <span> {purchaseData.price} </span> </div>
                        </div>

                        <div className='balance_block'>
                            <div className='balance_title'> <div className='b_icon'> <img src={Cash} alt="" /> </div> <p className='mb-0'> Available Balance </p> </div>
                            <div className='total_amount'> <div className='c-icon'> <img src={Coin} alt="" /> </div> <span> {User.user_credit?.toLocaleString('en')} </span> </div>
                        </div>

                        {purchaseData.price > User.user_credit &&  <div className='add_credits_block'>
                            <p className='mb-0'> Your Available Balance is low, please add credits </p>
                            <Link to="/packages" className='btn add_credit_btn' type='button'> Add Credits </Link>
                        </div>}

                        <div className='btn_block'>
                            <button type="button" className='btn submit_btn back-button' onClick={() => { setShowModal(false) }}> Cancel </button>
                            <button type="button" className='btn submit_btn' onClick={(e) => {purchaseModules(e, purchaseData)}}> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}


export default BuyCreditModal;