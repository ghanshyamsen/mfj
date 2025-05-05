import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Coin from '../../assets/images/coin.png'
function RewardSlider({recommended}) {

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
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false,
        }
      }
    ]
  };

  return (
    <div className="reward_slider review_slider">
        <Slider {...settings}>
            {recommended.map(item =>{
                return(
                  <div className='reward_card_outside' key={item.id}>
                      <Link to={`/product-detail/${window.createSlug(item.title)}/${item.id}`} className='reward_card_inside'>
                          <div className='reward_img'>
                              <img src={item.image} alt=""/>
                          </div>
                          <div className='reward_body'>
                              <p className='reward_title'> {item.title} </p>
                              <p className='category_text'> {item.category} </p>
                              <p className='coin_text'> <span><img src={Coin} alt=""/></span> {item.price} </p>
                          </div>
                      </Link>
                  </div>
                );
            })}
        </Slider>
    </div>
  );

}

export default RewardSlider;

