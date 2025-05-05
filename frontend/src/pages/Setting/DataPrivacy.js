import React, {useState} from 'react';
import PresonalData from './Data/PresonalData';
import DataPolicy from './Data/DataPolicy';
import u_AngleRight from '../../assets/images/u_angle-right-b.svg';

function DataPrivacy() {

    const [activeDataPrivacy, setActiveDataPrivacy] = useState('MyData');
    const [isWizardBlockVisible, setIsWizardBlockVisible] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userData'));

    const handleSetDataPrivacy = (value) => {
        setActiveDataPrivacy(value);
        setIsWizardBlockVisible(false);
    }

    const handleBackClick = () => {
        setIsWizardBlockVisible(true);
        setActiveDataPrivacy('MyData');
    }

    return(
        <>
            {isWizardBlockVisible && (
                <div className="wizard_block">
                    <div className="heading_block">
                        <h1 className="heading"> Data Privacy </h1>
                    </div>
                    <div className='setting_common_block data_privacy_block'>
                        <ul className="wizard_link">
                            {userInfo.user_type == 'teenager' && <li>
                                <a onClick={() => handleSetDataPrivacy('PersonalData')}> Request a copy of my personal data <img src={u_AngleRight} alt="angle right"/>  </a>
                            </li>}
                            <li>
                                <a onClick={() => handleSetDataPrivacy('DataPolicy')}> Data privacy policy <img src={u_AngleRight} alt="angle right"/> </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            <div className='wizard_conponent'>
                {activeDataPrivacy === 'PersonalData' && <PresonalData onBackClick={handleBackClick}/>}
                {activeDataPrivacy === 'DataPolicy' && <DataPolicy onBackClick={handleBackClick}/>}
            </div>

        </>
    );
}

export default DataPrivacy;

