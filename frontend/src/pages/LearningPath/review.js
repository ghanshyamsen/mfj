import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import User from '../../assets/images/user.jpg'
import { Rating } from 'primereact/rating';
import Slider from "react-slick";

function Reviews({reviews}) {

  var settings = {
    dots: false,
    centerMode: false, //Turn off center mode to remove extra space
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(3, reviews.length), //Show up to 3 reviews if available
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, reviews.length),
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(2, reviews.length),
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        }
      }
    ]
};


  return (
    <div className="review_slider">
        <Slider {...settings}>

            {
                reviews.map((review, index) => (
                    <div className="slider_card" key={index}>
                        <div className="slider_user">
                            <div className="user_img">
                                <img src={review.user_id.profile_image} alt="" />
                            </div>
                            <div className="s_user_info">
                                <p className="suser_name"> {review.user_id.first_name} {review.user_id.last_name} </p>
                                <p className="suser_location"> {review.user_id?.location}</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center rbox'>
                            {review.path_id?.title && <span className="s_status"> {review.path_id?.title}  </span>}
                            <Rating value={review.rating} readOnly cancel={false} />
                        </div>
                        <p className="description"> {review.review}</p>
                    </div>
                ))
            }

        </Slider>
    </div>
  );

}

export default Reviews;

