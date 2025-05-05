import React from 'react';
import Stripe from '../../../assets/images/stripe.png'
import starWhite from '../../../assets/images/star-white.png'
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import { Skeleton } from 'primereact/skeleton';
import { Link } from 'react-router-dom';

function Packages({user, packages, loadingSkeleton}) {

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <div className="wallet_page credit_packages_page">
                <div className='wallet_container'>
                    <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
                    <div className='cpp_content_block'>
                        <h1 className="cpp_title"> Credit Packages </h1>
                        <div className='cpp_card_block'>
                            {
                                packages.map((value) => (

                                    <div className='package_card_box' key={value._id}>
                                        {value.package_popular && <div className='popular_block'> <img src={starWhite} alt="" /> Most Popular </div>}
                                        <div className='pc_img'> <img src={value.package_image} alt="" /> </div>
                                        <div className='pc_body'>
                                            <h4 className='pc_name'> {value.package_name} </h4>
                                            <p className='pc_credits'
                                             style={{
                                                fontSize: value.package_credits >= 10000 ? '36px' : value.package_credits >= 1000 ? '42px' : '67px'
                                            }}
                                            > {value.package_credits.toLocaleString('en')} <span> Credits </span> </p>
                                            <p className='pc_discount'
                                             style={{
                                                fontSize: value.package_credits >= 10000 ? '24px' : value.package_credits >= 1000 ? '32px' : '40px'
                                            }}
                                            > <span className='doller'> $ </span> {value.package_price.toLocaleString('en')} {value.package_discount > 0 && <span> {value.package_discount.toLocaleString('en')}% Discount </span>} </p>
                                            <Link to={`/checkout/${value._id}`}  className='btn buy_btn'>Buy Now</Link>
                                        </div>
                                    </div>
                                ))

                            }

                            {packages.length === 0 ? (
                                loadingSkeleton ? (
                                    <Skeleton width="10rem" height="44px" className="me-1" borderRadius="30px" />
                                ) : (
                                    <div
                                        style={{
                                            padding: '50px 10px',
                                            textAlign: 'center',
                                            width: '100%',
                                            fontSize: '20px',
                                        }}
                                    >
                                        No Package Available
                                    </div>
                                    
                                )
                            ) : (
                                <></>
                            )}    


                        </div>
                        <div className='stripe_payment'>
                            <img src={Stripe} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Packages;