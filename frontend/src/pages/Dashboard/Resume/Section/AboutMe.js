import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import Edit from '../../../../assets/images/dashicons_edit.svg';

function AboutMe({data, maxHeight, className }) {

    const { key } = useParams();
    const navigation = useNavigate();

    const contentStyle = maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : {};

    useEffect(() => {
        const handleEditClick = (e) => {
          const target = e.target;
          const editBtn = target.closest('.edit-link');

          if (editBtn && editBtn.dataset.edit) {
            e.preventDefault(); // Prevent full page reload
            const section = editBtn.dataset.edit;

            if(section === 'about'){
                navigation('/objectives-summary?edit=/resume/'+key);
            }
          }
        };

        document.addEventListener('click', handleEditClick);
        return () => document.removeEventListener('click', handleEditClick);
    }, []);

    return (
        data && <>
            <div className={`${className} rinfo_block section clone about_section`} style={contentStyle}>
                <h2 className='heading push d-flex align-items-center justify-content-between'> about me
                    <a href={`${window.location.href}?edit=about`} className="edit-link edit_icon" data-edit="about"><img src={Edit} alt="edit" /></a>
                </h2>
                <p className="m-text push"> {data} </p>
            </div>
        </>
    );
}

export default AboutMe;