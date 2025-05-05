import React from 'react';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (

    <>
        <Modal className={`dashboard_modals ${theme}`} show={showModal} onHide={handleCloseModal} backdrop="static">
            <Modal.Header closeButton>
            <div className='icons'>
                <img src={sections[activeSectionIndex]?.icon} alt="" />
            </div>
            </Modal.Header>
            <Modal.Body>
            <div className='modal_content'>
                <h1 className='heading'>{sections[activeSectionIndex]?.text}</h1>
                <p className=''>Adding relevant certifications and training courses to your resume not only boosts your skills and qualifications but also positions you as a stronger contender in the job market.</p>
                <button className='btn continue_btn' onClick={handleSectionClick}>Continue</button>
            </div>
            </Modal.Body>
        </Modal>
        {/*  */}
    
    </>

/* 
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div> */
  );
};

export default Modal;