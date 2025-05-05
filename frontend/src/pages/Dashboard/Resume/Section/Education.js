
import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Edit from '../../../../assets/images/dashicons_edit.svg';

function Education({data, maxHeight}) {

    const { key } = useParams();
    const navegation = useNavigate();

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'education'){
                navegation('/education?edit=/resume/'+key);
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
                    Education
                    <a href="?edit=education" className="edit-link edit_icon" data-edit="education"><img src={Edit} alt="edit" /></a>
                </h2>
                {
                    data.map((value, index) =>(
                        <div key={index} className="push">
                            <h6 className="sub_title">{value.school_name}</h6>
                            <p className="m-text m_title"> {value.college_degree} , {value.study_field} </p>
                            <p className="d-text"> {window.formatDate(value.graduation_start_year)} {value.graduation_end_year?`- ${window.formatDate(value.graduation_end_year)}`:''} • GPA {value.gpa}</p>
                            <p className='m-text'> {value.education_description} </p>
                        </div>
                    ))
                }
            </div>
    );
}

export default Education;
