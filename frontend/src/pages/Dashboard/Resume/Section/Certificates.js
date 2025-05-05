import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Edit from '../../../../assets/images/dashicons_edit.svg';

function Certificates({data, maxHeight}) {

    const { key } = useParams();
    const navegation = useNavigate();

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'certification'){
                navegation('/certification-and-training?edit=/resume/'+key);
            }

          }
        };

        document.addEventListener('click', handleEditClick);
        return () => document.removeEventListener('click', handleEditClick);
    }, []);

    const contentStyle = maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : {};
    return (
        data.length > 0 &&
            <div className='rinfo_block certification_block section clone' style={contentStyle}>
                <h2 className='heading push d-flex align-items-center justify-content-between'>
                    Licenses & certifications
                    <a href="?edit=certification" className="edit-link edit_icon" data-edit="certification"><img src={Edit} alt="edit" /></a>
                </h2>
                {
                    data.map((value, index) => (
                        <div key={index} className="push">
                            <h6 className="sub_title">{value.certification_name}</h6>
                            <p className="m-text m_title"> {value.institution} </p>
                            <p className="d-text"> {window.formatDate(value.issue_date)} {value.expiry_date?`- ${window.formatDate(value.expiry_date)}`:''} </p>
                            {value?.category_of_field && <p className="d-text"> {value.category_of_field}</p>}
                            {value.credential_id && <p className="d-text"> Certificate Number {value.credential_id}</p>}
                            {value.credential_url && <p className="d-text"> URL {value.credential_url}</p>}
                        </div>
                    ))
                }
            </div>
    );
}

export default Certificates;
