import React, {useState, useEffect} from "react";
import Resources1 from '../../assets/images/howimg2.png';
import backArrow from '../../assets/images/fi_arrow-left.svg';
import { useParams, useNavigate} from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
function Resources() {


    const {key:Id} = useParams();
    const history = useNavigate();

    const TOKEN = localStorage.getItem('token');
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [article, setArticle] = useState({});


    const handleBack = () => {
        window.history.back();
    };

    useEffect(() => {
        loadArticle();
    },[])

    const loadArticle = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-articles/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status) {
                setArticle(result.data);
            }else{
                window.showToast(result.message, 'error');
                handleBack()
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));
    }


    return(
        <div className="common_background_block resources_detail_page">



                <div className="recent_block">
                    <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                    {/* resources block */}

                    {loadingSkeleton ?
                        <div className="resources_block">
                            <Skeleton width="100%" height='50px' className="mb-3"/>
                            <ul className="category_list mb-2">
                                <Skeleton width="100px" height='28px'/>
                            </ul>
                            <Skeleton width="150px" height='20px' className="mb-2"/>
                            <Skeleton width="100%" height='500px' className="mb-3"/>
                            <Skeleton width="100%" height='20px' className="mb-3"/>
                            <Skeleton width="100%" height='20px' className="mb-3"/>
                        </div>
                        :
                        <div className="resources_block">
                            <h3 className="rc_title"> {article?.title} </h3>

                            <ul className="category_list">
                                <li> {article?.category?.title} </li>
                            </ul>
                            <p className="pdate"> {article?.created} </p>
                            {article?.image && <div className="rc_img">
                                <img src={article?.image} alt="" />
                            </div>}
                            <div className="rc_body" dangerouslySetInnerHTML={{ __html: article?.description }}>
                                {/* <p className="rc_description" dangerouslySetInnerHTML={{ __html: article?.description }}> </p> */}
                            </div>
                        </div>
                    }
                </div>
        </div>
    )
}

export default Resources;