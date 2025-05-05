import React, {useState, useEffect, useRef } from 'react';
import { useWizard } from "react-use-wizard";
import { Skeleton } from 'primereact/skeleton';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

import downloadWhite from '../../../assets/images/download-white.png';
import downloadHover from '../../../assets/images/download-hover.png';


pdfMake.vfs = pdfFonts.pdfMake.vfs;


function Review({ goDashboardPage, setStep, setJobCount}) {
    const { goToStep } = useWizard();
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const TOKEN = localStorage.getItem('token');
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    const contentRef = useRef();

    const generatePdf = () => {
        const html = document.getElementById("content").innerHTML;
        const pdfContent = htmlToPdfmake(html);

        const documentDefinition_ = {
            content: pdfContent,
        };

        const documentDefinition = {
            content: [
                ...[
                    {
                        text: `Recommended Jobs`,
                        bold: true,
                        alignment : 'center',
                        fontSize: 20,
                        marginBottom : 20
                    }
                ],
                ...jobs.map((job, index) => ({
                    // Create a card-like style
                    stack: [
                        {
                            text: `${index + 1}. ${job.job_title}`,
                            style: 'header'
                        },
                        {
                            text:[ 
                                {
                                    text: 'Career :  ',
                                    color: '#666666',
                                },
                                `${job.career_title}`
                            ],
                            style: 'normal'
                        },
                        {
                            text:[ 
                                {
                                    text: 'Personality Traits :  ',
                                    color: '#666666',
                                },
                                `${job.personality_traits}`
                            ],
                            style: 'normal'
                        },
                        {
                            text:[ 
                                {
                                    text: 'Soft Skills :  ',
                                    color: '#666666',
                                },
                                `${job.soft_skills}`
                            ],
                            style: 'normal'
                        },
                        {
                            text:[ 
                                {
                                    text: 'Required Skills :  ',
                                    color: '#666666',
                                },
                                `${job.required_skills}`
                            ],
                            style: 'normal'
                        },
                        {
                            text: 'Typical Career Path',
                            style: 'subheader'
                        },
                        {
                            text:[ 
                                {
                                    text: 'Starter Job :  ',
                                    color: '#666666',
                                },
                                `${job.typical_career_path.starter_job}`
                            ],
                            style: 'normal'
                        },
                        {
                            text:[ 
                                {
                                    text: 'Mid Level :  ',
                                    color: '#666666',
                                },
                                `${job.typical_career_path.mid_level}`
                            ],
                            style: 'normal'
                        },
                        {
                            text:[ 
                                {
                                    text: 'Advanced :  ',
                                    color: '#666666',
                                },
                                `${job.typical_career_path.advanced}`
                            ],
                            style: 'normal'
                        },
                        {
                            text:[ 
                                {
                                    text: 'Specializations :  ',
                                    color: '#666666',
                                },
                                `${job.typical_career_path.specializations}`
                            ],
                            style: 'normal'
                        },
                        { text: '', margin: [0, 10] }, // Add space between cards
                    ],
                    // Card style
                    layout: {
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 10,
                        paddingBottom: 10,
                        background: '#F5F5F5',
                        margin: [0, 0, 0, 10],
                        border: [true, true, true, true],
                    },
                    border: [false, false, false, false], // No border around the entire card
                }))
            ],
            styles: {
                pagetitle: {
                    alignment: 'center',
                    fontSize: 16,
                    fontWeight: 700,  
                    color: '#1D1D1F',
                    margin: [0, 0, 25, 0],
                },
                header: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 10, 0],
                    color: '#1D1D1F'

                },
                subheader: {
                    fontSize: 10,
                    bold: true,
                    margin: [0, 10, 0, 5],
                    color: '#1D1D1F'
                },
                normal: {
                    fontSize: 8,
                    margin: [0, 5],
                    color: '#1D1D1F',
                },
                normal_text_title: {
                    
                }
            },
        };

        // Open the generated PDF in a new browser tab (instead of downloading)
        //pdfMake.createPdf(documentDefinition).open();
        pdfMake.createPdf(documentDefinition).download("Recommended_Jobs.pdf");
    };




    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume-builder`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if(result.status){
                setJobs(result.data?.starter_jobs);
                setJobCount(result.data?.starter_jobs.length);
                setTimeout(() => {
                    setLoading(true);
                }, 1000);
            }

          })
          .catch((error) => console.error(error.message))
          .finally(() => setLoadingSkeleton(false));
    },[])

    return(
        <>
            <div className='recommended_jobs_block'>

                {loadingSkeleton ?
                <div className='review_data pt-1'>
                    <div className='review_card'>
                        <div className='d-flex mb-2'> <span className='me-2'> <Skeleton width="10rem" height="1rem" className='mb-1' /> </span> <Skeleton width="10rem" height="1rem" className='mb-1' /> </div>
                        <div className='d-flex mb-2'> <span className='me-2'> <Skeleton width="10rem" height="1rem" className='mb-1' /> </span> <Skeleton width="10rem" height="1rem" className='mb-1' /> </div>
                        <div className='d-flex mb-2'> <span className='me-2'> <Skeleton width="10rem" height="1rem" className='mb-1' /> </span> <Skeleton width="10rem" height="1rem" className='mb-1' /> </div>
                        <div className='d-flex mb-2'> <span className='me-2'> <Skeleton width="10rem" height="1rem" className='mb-1' /> </span> <Skeleton width="10rem" height="1rem" className='mb-1' /> </div>
                    </div>
                </div>
                :
                <div className='review_data pt-1' id="content" ref={contentRef}>

                     {
                        jobs?.map((value, key) => (
                            <div className='review_card' key={key}>
                                <p className='rcjob_title'> <span className='count'>{key+1}.</span> {value.job_title} </p>

                                <p className=''> <span> Career : </span> {value.career_title} </p>
                                {/* <p className=''> <span> Personality Type : </span> {value.personality_type} </p> */}

                                <p className=''> <span> Personality Traits : </span> {value.personality_traits} </p>
                                <p className=''> <span> Soft Skills : </span> {value.soft_skills} </p>
                                <p className=''> <span> Required Skills : </span>{value.required_skills}</p>

                                <h3 className='rc_title'> Typical Career Path </h3>
                                <p className=''> <span> Starter Job : </span> {value.typical_career_path.starter_job} </p>
                                <p className=''> <span> Mid Level : </span> {value.typical_career_path.mid_level} </p>
                                <p className=''> <span> Advanced : </span> {value.typical_career_path.advanced} </p>
                                <p className=''> <span> Specializations : </span> {value.typical_career_path.specializations} </p>
                            </div>
                        ))
                    }
                </div>

                }


                {loadingSkeleton ?
                    <div className='btn_block'>
                        <Skeleton width="10rem" height="44px" className='me-1' borderRadius='30px'/> 
                        <Skeleton width="10rem" height="44px" className='' borderRadius='30px'/> 
                        <Skeleton width="10rem" height="44px" className='ms-1' borderRadius='30px'/> 
                    </div>
                :
                    <div className='btn_block'>
                        <button type="submit" className='btn submit_btn download_icon' style={{ marginRight: '10px' }} onClick={generatePdf}>
                            <img src={downloadWhite} alt="" />
                            <img src={downloadHover} alt="" />
                        </button>
                        <button type="button" className='btn submit_btn back-button' onClick={()=>{
                            goToStep(0);
                            setStep(1);
                        }}>Edit</button>
                        <button type="submit" className='btn submit_btn' onClick={goDashboardPage}>Exit</button>
                    </div>
                }
            </div>
        </>
    )
}

export default Review;