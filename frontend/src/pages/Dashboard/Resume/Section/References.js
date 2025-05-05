import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Phone from '../../../../assets/images/u_phone.png';
import Email from '../../../../assets/images/fi_mail.png';
import Edit from '../../../../assets/images/dashicons_edit.svg';

function References({data, maxHeight}) {

    const { key } = useParams();
    const navegation = useNavigate();

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'references'){
                navegation('/references?edit=/resume/'+key);
            }
          }
        };

        document.addEventListener('click', handleEditClick);
        return () => document.removeEventListener('click', handleEditClick);
    }, []);

    const contentStyle = maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : {};
    return (
        data.length > 0 &&
        <div className='rinfo_block contact_info_block referances_block section clone' style={contentStyle}>
            <h2 className='heading push d-flex align-items-center justify-content-between'>
                References
                <a href="?edit=references" className="edit-link edit_icon" data-edit="references"><img src={Edit} alt="edit" /></a>
            </h2>
            {
                data.map((value, index) => (
                    <div key={index} className="push voln">
                        <p className="owner"> {value.first_name} {value.last_name} </p>
                        <p className='ctitle'>{value.relation}</p>
                        <p className="ctitle"> {value.organization} </p>
                        <p className=''><img src={Phone} alt="" /> <span>{value.phone_number}</span> </p>
                        <p className=''><img src={Email} alt="" /> <span>{value.email}</span> </p>
                    </div>
                ))
            }
        </div>
    );
}

export default References;
