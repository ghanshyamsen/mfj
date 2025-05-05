import React from 'react';
import StudentWallet from './StudentWallet/StudentWallet';
import ParentWallet from './ParentWallet/ParentsWallet';
import './lmsdesign.css'

function Wallet() {

    const User = JSON.parse(localStorage.getItem('userData'));

    return (

        User.user_type === 'teenager'?
        <StudentWallet user={User} />:<ParentWallet user={User} />
    )
}

export default Wallet;
