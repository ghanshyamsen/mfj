
import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Edit from '../../../../assets/images/dashicons_edit.svg';

function WorkExperience({data, maxHeight}) {

    const { key } = useParams();
    const navegation = useNavigate();

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'WorkExperience'){
                navegation('/work-experience?edit=/resume/'+key);
            }
          }
        };

        document.addEventListener('click', handleEditClick);
        return () => document.removeEventListener('click', handleEditClick);
    }, []);

    const contentStyle = maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : {};

    return (
        data.length > 0 &&
            <div className='rinfo_block work_experience_block section  clone' style={contentStyle}>
                <h2 className='heading push d-flex align-items-center justify-content-between'>
                    Work Experience
                    <a href="?edit=WorkExperience" className="edit-link edit_icon" data-edit="WorkExperience"><img src={Edit} alt="edit" /></a>
                </h2>
                {
                    data.map((value, index) => (
                        <div key={index} className="push">
                            <h6 className="sub_title"> {value.title} </h6>
                            <p className="m-text m_title"> {value.company_name} </p>
                            <p className="d-text"> {window.formatDate(value.start_date)} {value.end_date?`- ${window.formatDate(value.end_date)}`:' - Present'}</p>
                            <p className='m-text'> {value.description} </p>
                            <p className="m-text m_title mb-0 mt-2"> Supervisor: {value.first_name} {value.last_name} </p>
                            <p className="d-text"> {value.phone_number} / {value.email} </p>
                        </div>
                    ))
                }
            </div>
    );
}

export default WorkExperience;