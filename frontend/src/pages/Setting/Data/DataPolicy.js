import React, {useState, useEffect} from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left.svg';

function DataPolicy({onBackClick}) {

    const [privacyData, setprivacyData] = useState([]);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(window.localStorage.getItem('token'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/app/data-privacy`, {
                    headers: {
                        'Authorization':  `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch Tutorials data');
                }

                const responseData = await response.json();
                if (responseData.status === 'success') {
                    setprivacyData(responseData.data);
                } else {
                    throw new Error(responseData.message);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, [token]);


    return(
        <>
            <div className="heading_block">
                <button type="button" className="back_btn" onClick={onBackClick}><img src={BackArrow} alt="" /></button>
                <h1 className="heading"> Data privacy policy </h1>
            </div>

            <div className='data_privacy_policy'>
                <div dangerouslySetInnerHTML={{ __html: privacyData.content }} />
            </div>
        </>
    );
}

export default DataPolicy;

