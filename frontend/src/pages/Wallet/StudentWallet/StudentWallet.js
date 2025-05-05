import React, {useEffect, useState} from 'react';
//import './wallet.css';
import Coin from '../../../assets/images/coin.png';
import Cash from '../../../assets/images/3d-cash-money.png';
import Cashicon from '../../../assets/images/C.png';
import { Link } from 'react-router-dom';
import Empty from '../../../assets/images/empty.png';
import { Skeleton } from 'primereact/skeleton';

function StudentWallet({user}) {

    const User = JSON.parse(localStorage.getItem('userData'));
    const TOKEN = localStorage.getItem('token');
    const [txn, setTxn] = useState([]);
    const [credit, setCredit] = useState(0);
     const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    useEffect(() => {
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

    return (
        <>
            <div className='student_wallet_page wallet_page'>
                <div className='wallet_container'>

                    <div className='wtop_row'>
                        <div className='btn_block'>
                            <Link to="/packages" className='btn purchase_credits_btn'> Purchase Credits </Link>
                        </div>
                        <div className='balance_block'>
                            <div className='balance_title'>
                                <div className='b_icon'> <img src={Cash} alt="cash" /> </div>
                                <p className='mb-0'> Available Balance </p>
                            </div>
                            <div className='total_amount'>
                                <div className='c-icon'> <img src={Coin} alt="coin" /> </div>
                                <span>  {credit.toLocaleString('en')||0} </span>
                            </div>
                        </div>
                    </div>

                    <div className='transaction_table_block transaction-table '>
                        <h1 className='tra_title'> All Transactions </h1>
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
                                loadingSkeleton ?<Skeleton  width="100%" height='20px' className='m-auto' />:
                                <div className='empty_wallet'>
                                    <p className='wallet_text'> No Transactions Found </p>
                                </div>
                            }

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default StudentWallet;
