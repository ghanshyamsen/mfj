import React, { useState, useEffect } from "react";
import JobSlider from "./JobSlider";
import { useParams, useNavigate } from 'react-router-dom'
import { Rating } from 'primereact/rating';
import { Skeleton } from 'primereact/skeleton';
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import logoimg from '../../../assets/images/no_image_logo.jpg';

function CompanyDetail() {

    const {key:Id} = useParams();
    const history = useNavigate();

    const [company, setCompany] = useState({});
    const [loading, setLoading] = useState(false);
    const TOKEN = localStorage.getItem('token');
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-company/${Id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setCompany(result.data);
                setLoading(true);
            }else{
                window.showToast(result.message,'error');
                history('/dashboard');
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));

    },[])

    const handleBack = () => {
        window.history.back();
    };

    return(
        <>
            {loading && <div className="common_background_block company_job_detail_page">
                <div className='detail_block'>
                    <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                    <div className='detail-product'>
                        <div className='aul_content'>
                            <h4 className='application_name'> {loadingSkeleton ? <Skeleton width="100%" height='30px' /> : `${company.business_type}`} </h4>
                            <div className="company_review">
                            {loadingSkeleton ?
                                <Skeleton width="100%" height="20px" />
                            :
                               <>{company.rating}/5 <Rating value={company.rating} readOnly={true} cancel={false} /></>
                            }
                            </div>
                            <p className='amount'> {loadingSkeleton ? <Skeleton width="100%" /> : `${company.employer_type}` } </p>
                            <p className='aul_text aul_location'> {loadingSkeleton ? <Skeleton width="100%" /> : `${company.street_address||company.location},` } </p>
                            <p className='aul_text aul_location'> {loadingSkeleton ? <Skeleton width="100%" /> : company.city } </p>
                            <p className='aul_text aul_location'> {loadingSkeleton ? <Skeleton width="100%" /> : `${company.state}, ${company.zip_code}` } </p>
                            <p className='aul_text aul_location'> {loadingSkeleton ? <Skeleton width="100%" /> : <span> <b style={{fontWeight:600}}>Company Size</b> : {company.number_of_employees} </span> } </p>
                        </div>

                        <div className='icon'>
                            {loadingSkeleton ? <Skeleton shape="circle" size="100%" className=""></Skeleton> :
                            <img src={company.company_logo==="" ? logoimg : company.company_logo } alt="" />
                            }
                        </div>
                    </div>
                    {/*  */}

                    <JobSlider jobs={company.jobs} />

                    {/*  */}
                    {company.company_purpose && <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> {loadingSkeleton ? <Skeleton width="50%"  className="mb-1"/> : 'Company Purpose' } </p>
                            <p className='ans'> {loadingSkeleton ? <Skeleton width="100%" /> : `${company.company_purpose}` } </p>
                        </div>
                    </div>}

                    {company.company_culture && <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> {loadingSkeleton ? <Skeleton width="50%" className="mb-1" /> : "Company Culture" } </p>
                            <p className='ans'> {loadingSkeleton ? <Skeleton width="100%" /> : `${company.company_culture}` } </p>
                        </div>
                    </div>}

                    {company.company_values && <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> {loadingSkeleton ? <Skeleton width="50%"  className="mb-1" /> : 'Company Values' } </p>
                            <p className='ans'> {loadingSkeleton ? <Skeleton width="100%" /> : `${company.company_values}` } </p>
                        </div>
                    </div>}

                    {company.company_life && <div className='review_box'>
                        <div className='review_content'>
                            <p className='que'> {loadingSkeleton ? <Skeleton width="50%" className="mb-1" /> : 'Life at Your Company' } </p>
                            <p className='ans'> {loadingSkeleton ? <Skeleton width="100%" /> : `${company.company_life}` } </p>
                        </div>
                    </div>}
                    {/*  */}

                </div>
            </div>}
        </>
    );
}

export default CompanyDetail;