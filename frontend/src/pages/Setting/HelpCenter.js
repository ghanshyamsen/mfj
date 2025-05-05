import React, {useState} from 'react';

import LiveChat from './helpCenter/LiveChat';
import EmailUs from './helpCenter/EmailUs';
import CallUs from './helpCenter/CallUs';
import Tutorials from './helpCenter/Tutorials';
import FAQ from './helpCenter/FAQ';

import u_AngleRight from '../../assets/images/u_angle-right-b.svg';

function HelpCenter() {

    const [activeDataPrivacy, setActiveDataPrivacy] = useState('MyData');
    const [isWizardBlockVisible, setIsWizardBlockVisible] = useState(true);

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
                <div className='wizard_block'>
                    <div className="heading_block">
                        <h1 className="heading"> Help Center </h1>
                    </div>
                    <div className='setting_common_block data_privacy_block'>
                        <ul className="wizard_link">
                            {/* <li>
                                <a onClick={() => handleSetDataPrivacy('LiveChat')}> Live chat <img src={u_AngleRight} alt="img"/>  </a>
                            </li> */}
                            <li>
                                <a onClick={() => handleSetDataPrivacy('EmailUs')}> Email Us <img src={u_AngleRight} alt="img"/> </a>
                            </li>
                            {/* <li>
                                <a onClick={() => handleSetDataPrivacy('CallUs')}> Call Us <img src={u_AngleRight} alt="img"/> </a>
                            </li> */}
                            <li>
                                <a onClick={() => handleSetDataPrivacy('Tutorials')}> Tutorials <img src={u_AngleRight} alt="img"/> </a>
                            </li>
                            <li>
                                <a onClick={() => handleSetDataPrivacy('FAQ')}> FAQ <img src={u_AngleRight} alt="img"/> </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            <div className='wizard_conponent'>
                {activeDataPrivacy === 'LiveChat' && <LiveChat onBackClick={handleBackClick}/>}
                {activeDataPrivacy === 'EmailUs' && <EmailUs onBackClick={handleBackClick}/>}
                {activeDataPrivacy === 'CallUs' && <CallUs onBackClick={handleBackClick}/>}
                {activeDataPrivacy === 'Tutorials' && <Tutorials onBackClick={handleBackClick}/>}
                {activeDataPrivacy === 'FAQ' && <FAQ onBackClick={handleBackClick}/>}
            </div>

        </>
    );
}

export default HelpCenter;

