import React, {useState, useEffect} from 'react';
import { Skeleton } from 'primereact/skeleton';

const Badges = ({id}) => {

    const TOKEN = localStorage.getItem('token');
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getlist()
    },[]);

    const getlist = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-badges/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setBadges(result.data);
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }

    return (
        <>
            {badges.length > 0 && <div className="dcb_block">
                <h1 className="d_title"> {loading ? <Skeleton width="246px" height='2rem'/> : 'Badges Earned' } </h1>
                {loading ? 
                    <ul className='badge_list'>
                    {
                        badges.map((badge) => (
                            <li key={badge._id}>
                                <div className='badge_icon'> <Skeleton width="100%" height='100%'/> </div>
                                <h2 className='badge_name'> <Skeleton width="100%" height='15px'/>  </h2>
                            </li>
                        ))
                    }
                </ul>
                : 
                <ul className='badge_list'>
                    {
                        badges.map((badge) => (
                            <li key={badge._id}>
                                <div className='badge_icon'> <img src={badge.badge_image} alt="" /> {badge.count > 1 && <span className='badge_count'> {badge.count} </span>} </div>
                                <h2 className='badge_name'> {badge.badge_name}  </h2>
                            </li>
                        ))
                    }
                </ul>}
            </div>}
        </>

    )
}


export default Badges;