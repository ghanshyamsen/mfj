import React, {useEffect, useState} from 'react';
import StudentPackages from './StudentWallet/StudentPackages';
import ParentsPackages from './ParentWallet/ParentsPackages';

function Package() {

    const [packages, setPackages] = useState([]);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    const User = JSON.parse(localStorage.getItem('userData'));
    const TOKEN = localStorage.getItem('token');

    useEffect(() => {
        getPackages()
    },[])

    const getPackages = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-packages`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setPackages(result.data);
                setLoadingSkeleton(false);
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));
    }

    const buyCredit = () => {



    }

    return (

        User.user_type === 'teenager'?
        <StudentPackages user={User} packages={packages} loadingSkeleton={loadingSkeleton} />:<ParentsPackages user={User} packages={packages} loadingSkeleton={loadingSkeleton} />
    )
}

export default Package;
