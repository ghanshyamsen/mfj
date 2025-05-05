import React, {useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import goalimg from '../../assets/images/pro2.jfif';
import Cashicon from '../../assets/images/3d-cash-money.png';
import Coin from '../../assets/images/coin.png';

function Goal() {

    const TOKEN = localStorage.getItem('token');
    const [goals, setGoals] = useState([]);
    const [propath, setProPath] = useState('');

    useEffect(() => {
        fetchGoal();
    },[])

    const fetchGoal = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-set-goals`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setGoals(result.data);
                setProPath(result.path);
            }
        })
        .catch((error) => console.error(error.message));
    }

    const GoalCard = ({values}) => {

        return (<>
            {values.map((goal) => {

                const isProductReward = goal.reward_type === 'product';
                const isCreditReward = goal.reward_type === 'credit';
                const isPathReward = goal.reward_for === 'path';
                const isSkillReward = goal.reward_for === 'skill';
                const rewardImage = isProductReward ? propath + goal.reward_product?.image : Cashicon;
                const rewardTitle = isProductReward
                    ? goal.reward_product?.title
                    : (
                        <>Reward: <img src={Coin} alt="" /> ${goal.reward_credit}</>
                    );
                const completedOn = isPathReward
                    ? goal.reward_path?.title
                    : goal.reward_skill?.title;

                const Name = goal.teenager.first_name + ' ' +goal.teenager.last_name;

                // Only render if required data is present
                if (
                    (isProductReward && goal.reward_product?._id && ((isPathReward && goal.reward_path?._id) || (isSkillReward && goal.reward_skill?._id))) ||
                    (isCreditReward && ((isPathReward && goal.reward_path?._id) || (isSkillReward && goal.reward_skill?._id)))
                ) {
                    return (

                        <div className='goal_box' key={goal._id}>
                            <div className='goal_img'>
                                {isProductReward ?
                                    <Link to={`/product-detail/${window.createSlug(rewardTitle)}/${goal.reward_product._id}`} style={{textDecoration:'none',color:'#1D1D1F'}}>
                                        <img src={rewardImage} alt={rewardTitle} />
                                    </Link>:<img src={rewardImage} alt={rewardTitle} />
                                }
                            </div>
                            <div className='gb_right'>
                                {isProductReward?<Link to={`/product-detail/${window.createSlug(rewardTitle)}/${goal.reward_product._id}`} style={{textDecoration:'none',color:'#1D1D1F'}}>
                                    <h3 className='goal_title'>{rewardTitle}</h3>
                                </Link>:<h3 className='goal_title'>{rewardTitle}</h3>}
                                <p className='goal_desc'> On completing the <b>“{completedOn}”</b> {isPathReward?'learning path':'skill'}</p>
                                <p className='goal_desc'> Assigned to <Link to={`/member-info/${goal.teenager._id}`} style={{textDecoration:'none',color:'#1D1D1F'}}> {Name} </Link></p>
                            </div>
                        </div>
                    );
                }

                return null; // Don't render anything if conditions are not met
            })}
        </>)
    }

    return(
        <>
            <div className="heading_block">
                <h1 className="heading"> Goal </h1>
            </div>


            <div className='setting_common_block personal_info_block goal_page_content'>
                <div className='goal_content_block' >
                    <GoalCard values={goals} />
                </div>
            </div>

        </>
    );
}

export default Goal;

