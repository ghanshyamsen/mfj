import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Edit from '../../../../assets/images/dashicons_edit.svg';


function Awards({data, maxHeight}) {

    const { key } = useParams();
    const navegation = useNavigate();

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'award'){
                navegation('/awards-and-achievements?edit=/resume/'+key);
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
                    Awards and Achievements
                    <a href="?edit=award" className="edit-link edit_icon" data-edit="award"><img src={Edit} alt="edit" /></a>
                </h2>
                {
                    data.map((value, index) => (
                        <div key={index} className="pushs">
                            <h6 className="sub_title">{value.certification_name}</h6>
                            <p className="m-text m_title"> {value.awarding_organization} • {window.formatDate(value.date_received)} </p>
                            <p className="d-text"> {value.brief_description}</p>
                        </div>
                    ))
                }
            </div>
    );
}

export default Awards;
