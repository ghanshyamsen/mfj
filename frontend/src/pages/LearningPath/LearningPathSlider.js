
import React, { useRef, useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Medal2 from '../../assets/images/Medal2.png'
import Coin from '../../assets/images/coin.png';
import { Rating } from 'primereact/rating';
import Slider from "react-slick";
import Review from './review'
function LearningPathSlider({otherpath}) {

    const classes = ["gb1", "gb2", "gb3", "gb4"];
    const TOKEN = localStorage.getItem('token');
    const [reviews, setReviews] = useState([]);


    useEffect(() => {
        getReviews();
    },[])

    var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: true,
          arrows: false,
        }
      }
    ]
  };

  const getReviews = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/lms-reviews`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
        if(result.status){
            setReviews(result.data);
        }
    })
    .catch((error) => console.error(error.message));
}
// Updated code
return (
  <div className="review_slider">
      <Slider {...settings}>
          {
              otherpath.map((value, index) => {

                  return (
                      <div className='learning_card_block' key={value.id}>
                          <div className='learning_inner'>
                              <div className={`top_row ${classes[index % classes.length]}`}>
                                  <h1 className='lcb_title'> {value.title}</h1>
                                  <div className='bage_img'> <img src={value.thumbnail} alt="" /> </div>
                              </div>
                              <div className='learn_body'>
                                  <h2 className='lb_title'> Total Skills {value.skills} </h2>
                                  <div className='review_block'>
                                      <p className='review_sm'> Reviews received </p>
                                      <div className='d-flex align-items-center rbox'>
                                          <Rating value={parseFloat(value.avg_rating)} readOnly cancel={false} />
                                          <span className='rading_count'>{value.avg_rating} ({value.total_ratings})</span>
                                      </div>
                                  </div>
                                  <p className='credit_text'> Buy for <img src={Coin} alt="" /> <span>{value.credit_price}</span> </p>
                                  <div className='view_btn text-center'>
                                      <Link to={`/learning-path-detail/${value.id}`} className='btn'>View Details</Link>
                                  </div>
                              </div>
                          </div>
                      </div>
                  );
              })
          }
      </Slider>
  </div>
);
}

export default LearningPathSlider;

