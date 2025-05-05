import React from "react";
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

function CompanyJob({jobs}) {

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 1199,
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
    <div className="slider-container">
      <Slider {...settings}>
        {
          jobs.map((job, index) =>(
            <Link to={`/job-detail/${job._id}`} className="aul_content" key={index}>
              <h4 className="application_name">{job.job_position}</h4>
              <p className='amount'>{job.job_payscale}</p>
              <p className='aul_text aul_keyword'>{job?.job_pay_type}</p>
              <p className='aul_text aul_keyword'>{job.orgnaization}</p>
              <p className='aul_text aul_location'>{job.location||''}</p>
              <button type="button" className="btn apply_btn"> View job</button>
            </Link>
          ))
        }
      </Slider>
    </div>
  );

}

export default CompanyJob;

