import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Edit from '../../../../assets/images/dashicons_edit.svg';

function Skills({data, maxHeight}) {

    const { key } = useParams();
    const navegation = useNavigate();

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'skills'){
                navegation('/skills-assessment?edit=/resume/'+key);
            }
          }
        };

        document.addEventListener('click', handleEditClick);
        return () => document.removeEventListener('click', handleEditClick);
    }, []);

    const contentStyle = maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : {};
    return (
        data.length > 0 &&
        <div className='linfo_block section clone' style={contentStyle}>
            <h2 className='heading push d-flex align-items-center justify-content-between'>
                <span> skills </span>
                <a href="?edit=skills" className="edit-link edit_icon" data-edit="skills"><img src={Edit} alt="edit" /></a>
            </h2>
            {
                data.map((value, index) => (
                    <p key={index} className="push img-combo">
                        <span className='hobi_img'>{value.image && <img src={value.image} alt={`ski${index}`} />}</span>
                        <span>{value.name}</span>
                    </p>
                ))
            }
        </div>
    );
}

export default Skills;
