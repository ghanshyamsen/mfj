import React, { useState, useEffect } from 'react';
import BackArrow from '../../../assets/images/fi_arrow-left.svg';
import { Skeleton } from 'primereact/skeleton';
import { Link } from "react-router-dom";

function FAQ({ onBackClick }) {
    const [faqData, setFaqData] = useState([]);
    const [error, setError] = useState(null);
    const token = window.localStorage.getItem('token');
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [queData, setQueData] = useState([]);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/app/get-faqs`, {
                    headers: {
                        'Authorization':  `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch FAQ data');
                }

                const responseData = await response.json();
                if (responseData.status === 'success') {
                    setFaqData(responseData.data);
                    setTimeout(() => {
                        setLoadingSkeleton(false);
                    }, 1000);
                } else {
                    throw new Error(responseData.message);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();

    }, [token]);


    const handleGuideClick = async (id) => {
        setSelectedGuide(id);
        setLoadingSkeleton(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/app/get-faqs/${id}`, {
                headers: {
                    'Authorization':  `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch FAQ data');
            }

            const responseData = await response.json();
            if (responseData.status === 'success') {
                setQueData(responseData.data);
                setTimeout(() => {
                    setLoadingSkeleton(false);
                }, 1000);
            } else {
                throw new Error(responseData.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const onFaqBackClick = () => {
        setLoadingSkeleton(true);
        setTimeout(() => {
            setSelectedGuide(null);
            setLoadingSkeleton(false);
        }, 1000);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='wizard_block'>
            {!selectedGuide && (
                <div className='faq_main_content'>
                    <div className="heading_block">
                        <button type="button" className="back_btn" onClick={onBackClick}>
                            {loadingSkeleton ? <Skeleton width="32px" height='32px' /> : <img src={BackArrow} alt="Back" /> }
                        </button>
                        <h1 className="heading">{loadingSkeleton ? <Skeleton width="200px" height='32px' /> : "FAQ" }</h1>
                    </div>
                    <div className='setting_common_block'>
                        {faqData.map((guide, index) => (
                            guide.faqs.length > 0 && (
                            <div className='fmc-block' key={index}>
                                <h1>{loadingSkeleton ? <Skeleton width="200px" height='28px' /> : `${guide.title}` } </h1>
                                <ul>
                                    {guide.faqs.map((question, idx) => (
                                        loadingSkeleton ?
                                        <li key={idx}>
                                            <Skeleton width="100%" className='mb-1'/>
                                        </li>
                                        :
                                        <li key={idx}>
                                            <Link onClick={() => handleGuideClick(question._id)}>{question.question}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                         )
                        ))}
                    </div>
                </div>
            )}


            {selectedGuide && (
                <div className='faq_que_content'>
                    <div className="heading_block">
                        <button type="button" className="back_btn" onClick={onFaqBackClick}>
                            {loadingSkeleton ? <Skeleton width="32px" height='32px' /> : <img src={BackArrow} alt="Back" /> }
                        </button>
                        <h1 className="heading">{loadingSkeleton ? <Skeleton width="200px" height='32px' /> : "FAQ" } </h1>
                    </div>

                    {loadingSkeleton ?
                        <div className='setting_common_block'>
                            <div className='que_ans_block'>
                                <h1 className='que'> <Skeleton width="100%" height='2rem' /> </h1>
                                <div className='ans'><Skeleton width="100%" className='mb-1'/><Skeleton width="100%" className='mb-1'/><Skeleton width="100%" className='mb-1'/><Skeleton width="100%" className='mb-1'/></div>
                            </div>
                        </div>
                    :
                    <div className='setting_common_block'>
                        <div className='que_ans_block'>
                            <h1 className='que'>{queData.question}</h1>
                            <p className='ans' dangerouslySetInnerHTML={{ __html: window.convertUrlsToLinks(queData.answer) }}></p>
                        </div>
                    </div>
                    }
                </div>
            )}
        </div>
    );
}

export default FAQ;
