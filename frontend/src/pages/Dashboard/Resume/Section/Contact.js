import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Phone from '../../../../assets/images/u_phone.png';
import Email from '../../../../assets/images/fi_mail.png';
import mapMarker from '../../../../assets/images/u_map-marker-alt.png';

import Edit from '../../../../assets/images/dashicons_edit.svg';

function Contact({data, maxHeight}) {

    const { key } = useParams();
    const navegation = useNavigate();

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'contact'){
                navegation('/personal-detail?edit=/resume/'+key);
            }
          }
        };

        document.addEventListener('click', handleEditClick);
        return () => document.removeEventListener('click', handleEditClick);
    }, []);


    const contentStyle = maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : {};
    return (
        <div className='linfo_block contact_info_block section push' style={contentStyle}>
            <h2 className='heading d-flex align-items-center justify-content-between'>
                <span> contact </span>
                <a href="?edit=contact" className="edit-link edit_icon" data-edit="contact"><img src={Edit} alt="edit" /></a>
            </h2>
            <p className=''><img src={Phone} alt="" /> <span>{data.phone_number}</span> </p>
            <p className=''><img src={Email} alt="" /> <span>{data.email}</span> </p>
            <p className=''><img src={mapMarker} alt="" /> <span>{data.location}</span> </p>
        </div>
    );
}

export default Contact;
