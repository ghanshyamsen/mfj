
import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Edit from '../../../../assets/images/dashicons_edit.svg';

function VolunteerExperience({data,  maxHeight}) {

    const { key } = useParams();
    const navegation = useNavigate();

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'VolunteerExperience'){
                navegation('/volunteer-experience?edit=/resume/'+key);
            }
          }
        };

        document.addEventListener('click', handleEditClick);
        return () => document.removeEventListener('click', handleEditClick);
    }, []);

    const contentStyle = maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : {};
    return (
        data.length > 0 &&
        <div className='rinfo_block section clone' style={contentStyle}>
            <h2 className='heading push d-flex align-items-center justify-content-between'>
                Volunteer Experience
                <a href="?edit=VolunteerExperience" className="edit-link edit_icon" data-edit="VolunteerExperience"><img src={Edit} alt="edit" /></a>
            </h2>
            {
                data.map((value, index) => (
                    <div key={index}  className="push voln">
                        <h6 className="sub_title">{value.organizationname}</h6>
                        <p className="m-text m_title"> {value.responsibilities} </p>
                        <p className="d-text"> {window.formatDate(value.startdate)} {value.enddate?`- ${window.formatDate(value.enddate)}`:''} {value.totalhours?'• '+value.totalhours+' Hours':''}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default VolunteerExperience;
