import React from "react";
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Skeleton } from 'primereact/skeleton';


import Slider from "react-slick";

import Star from '../../../assets/images/Star.svg';
import logoimg from '../../../assets/images/no_image_logo.jpg';

function FeaturedJobsSlider({jobs, loadingSkeleton, loading}) {

  jobs = jobs.filter(value => {
    return value.job_boost && value;
  });

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };



  return (
    <>
      {jobs?.length > 0 && <div className="slider-container featured_job_slider_container">
          <h2 className="fjs_title"> Featured Jobs  </h2>
          <div className='application_ul_list'>
              <ul>
                  <Slider {...settings}>

                      {jobs && jobs.length > 0 ? (
                          jobs.map(job => {
                            return <li key={job.id}>
                              <div className='icon'>
                                <img src={job.logo==="" ? logoimg : job.logo }   alt="" />
                              </div>
                              <div className='aul_content'>
                                  {job?.job_boost &&  <div className='job_tag'> <img src={Star} alt="" /> Featured Job <img src={Star} alt="" /> </div>}
                                  <h4 className='application_name'> <Link to={`/job-detail/${job.id}`}> {job.job_position} </Link> </h4>
                                  <p className='amount'>{job.job_payscale}</p>
                                  <p className='aul_text aul_keyword'>{job?.job_pay_type}</p>
                                  <p className='aul_text aul_keyword'>{job.orgnaization}</p>
                                  <p className='aul_text aul_location'>{job.location||''}</p>
                                  <Link to={`/job-detail/${job.id}`}> <button className='btn apply_btn'>View Job</button> </Link>
                              </div>
                            </li>
                          })
                        ) : (
                          loadingSkeleton ?
                            [1, 2, 3].map((_, index) => (
                              <li key={index}>
                                <div className='icon'>
                                    <Skeleton shape="circle" size="100%" className="mr-2" />
                                </div>
                                <div className='aul_content'>
                                  <div className='application_name'><Skeleton width="100%" height='30px' /> </div>
                                  <div className='amount'><Skeleton width="100%" height='20px' /></div>
                                  <div className='aul_text aul_keyword'><Skeleton width="100%" height='20px' /></div>
                                  <div className='aul_text aul_location'><Skeleton width="100%" height='20px' /></div>
                                  <Skeleton className='button' width="98px" height='34px' />
                                </div>
                              </li>
                            ))

                          : loading && <li className='notshowjob'> We couldn't find any jobs matching your request. </li>
                      )}

                  </Slider>
              </ul>
          </div>
      </div>}
    </>
  );

}

export default FeaturedJobsSlider;

