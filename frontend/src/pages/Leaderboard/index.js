import React, {useState, useEffect} from 'react';
import Medalimg from '../../assets/images/medalimg2.png'
import levelImg1 from '../../assets/images/level_img1.png'
import levelImg2 from '../../assets/images/level_img2.png'
import levelImg3 from '../../assets/images/level_img3.png'
import levelImg4 from '../../assets/images/level_img4.png'

import levelImg5 from '../../assets/images/level_img5.png'
import AwardBages1 from '../../assets/images/award-badges1.png'
import AwardBages2 from '../../assets/images/award-badges2.png'
import AwardBages3 from '../../assets/images/award-badges3.png'

import user1 from '../../assets/images/img1.jfif'

import './index.css';

function LearningPath() {

    const TOKEN = localStorage.getItem('token');
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getRecords()
    },[]);


    const getRecords = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-leader-board`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setList(result.data);
            }
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoading(true));
    }

    const classMap = {
        0: "lbt_first_tr",
        1: "lbt_second_tr",
        2: "lbt_third_tr",
        3: "lbt_four_tr",
        4: "lbt_five_tr",
    };

    return(
        <>
            <div className='leaderboard_page'>
                <div className='common_container'>
                    <div className='leaderboard_body'>
                        <div className='heading_row'>
                            <img src={Medalimg} alt=""/>
                            <h1 className='page_title'> Leaderboard <span> This Month's Top 10 </span> </h1>
                            <img src={Medalimg} alt=""/>
                        </div>
                        {/*  */}
                        <div className='lbt_outer_block'>
                            <div className='leader_board_table'>
                                <div className='lbt_thead'>
                                    <p className=''>#</p>
                                    <p className=''>Student</p>
                                    <p className=''>Learning Paths</p>
                                    <p className=''>Rank</p>
                                    <p className=''>Skills</p>
                                </div>
                                {/*  */}
                                <div className='lbt_tbody'>

                                    {
                                        loading && list.length > 0 && list.map((user, index) => (
                                            <div className={`lbt_tr ${classMap[index] || ""}`}>

                                                <p className='rank'>
                                                    {index === 0 && <img src={AwardBages1} alt=""/>}
                                                    {index === 1 && <img src={AwardBages2} alt=""/>}
                                                    {index === 2 && <img src={AwardBages3} alt=""/>}
                                                    <span> {index+1} </span>
                                                </p>
                                                <p className='user_info'>
                                                   {/*  <span className='user_img'>
                                                        <div className="hexa">
                                                            <div className="hex1">
                                                                <div className="hex2">
                                                                    <img src={user.userInfo?.profile_image} alt="" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span> */}
                                                    <div className="hexa">
                                                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                                            <clipPath id="hexClip">
                                                                <polygon points="50 0, 100 25, 100 75, 50 100, 0 75, 0 25" />
                                                            </clipPath>
                                                            <image href={user.userInfo?.profile_image} clip-path="url(#hexClip)" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                                                        </svg>
                                                    </div>
                                                    <span className='user_name'> {user.userInfo?.first_name} {user.userInfo?.last_name} </span>
                                                </p>
                                                <p className=''>{user.pathCount}</p>
                                                <p className='level_img'>
                                                    {user?.rankInfo?.image && <img src={user.rankInfo.image} alt="" />}
                                                </p>
                                                <p className=''>{user.skillCount}</p>
                                            </div>
                                        ))
                                    }

                                    {loading && list.length <= 0 && <div className="notext">No listings found for this month. Please check back later!</div>}

                                    {/* <div className='lbt_tr lbt_second_tr'>
                                        <p className='rank'> <img src={AwardBages2} alt=""/> <span> #2 </span> </p>
                                        <p className='user_info'>
                                            <span className='user_img'>
                                                <div className="hexa">
                                                    <div className="hex1">
                                                        <div className="hex2">
                                                            <img src={user1} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                            <span className='user_name'> Mundungus Fletcher </span>
                                        </p>
                                        <p className=''>11</p>
                                        <p className='level_img'> <img src={levelImg4} alt="" /> </p>
                                        <p className=''>47</p>
                                    </div>

                                    <div className='lbt_tr lbt_third_tr'>
                                        <p className='rank'> <img src={AwardBages3} alt=""/> <span> #3 </span> </p>
                                        <p className='user_info'>
                                            <span className='user_img'>
                                                <div className="hexa">
                                                    <div className="hex1">
                                                        <div className="hex2">
                                                            <img src={user1} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                            <span className='user_name'> Remus Lupin </span>
                                        </p>
                                        <p className=''>10</p>
                                        <p className='level_img'> <img src={levelImg4} alt="" /> </p>
                                        <p className=''>44</p>
                                    </div>

                                    <div className='lbt_tr lbt_four_tr'>
                                        <p className=''>  #4 </p>
                                        <p className='user_info'>
                                            <span className='user_img'>
                                                <div className="hexa">
                                                    <div className="hex1">
                                                        <div className="hex2">
                                                            <img src={user1} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                            <span className='user_name'> Remus Lupin </span>
                                        </p>
                                        <p className=''>9</p>
                                        <p className='level_img'> <img src={levelImg3} alt="" /> </p>
                                        <p className=''>40</p>
                                    </div>

                                    <div className='lbt_tr lbt_five_tr'>
                                        <p className=''> #5 </p>
                                        <p className='user_info'>
                                            <span className='user_img'>
                                                <div className="hexa">
                                                    <div className="hex1">
                                                        <div className="hex2">
                                                            <img src={user1} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                            <span className='user_name'> Remus Lupin </span>
                                        </p>
                                        <p className=''>8</p>
                                        <p className='level_img'> <img src={levelImg2} alt="" /> </p>
                                        <p className=''>39</p>
                                    </div>

                                    <div className='lbt_tr'>
                                        <p className=''> #6 </p>
                                        <p className='user_info'>
                                            <span className='user_img'>
                                                <div className="hexa">
                                                    <div className="hex1">
                                                        <div className="hex2">
                                                            <img src={user1} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                            <span className='user_name'> Remus Lupin </span>
                                        </p>
                                        <p className=''>7</p>
                                        <p className='level_img'> <img src={levelImg1} alt="" /> </p>
                                        <p className=''>38</p>
                                    </div> */}

                                </div>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LearningPath;