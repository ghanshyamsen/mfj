import React, { useState, useEffect } from 'react';
import topArrow from './../assets/images/top.png';

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show the button when scrolled more than 300px
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll back to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            padding: '10px',
            borderRadius: '50%',
            backgroundColor: '#EE844F',
            border: 'none',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
          }}
        >
          <img style={{width: "20px", height: "20px", verticalAlign: 'top' }} src={topArrow} alt="" />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
