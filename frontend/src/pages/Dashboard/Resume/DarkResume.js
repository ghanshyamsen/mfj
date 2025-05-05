import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import $ from "jquery";

import user from '../../../assets/images/img2.jfif';
import download from '../../../assets/images/download.svg';

/* Section */
import AboutMe from './Section/AboutMe';
import WorkExperience from './Section/WorkExperience';
import Education from './Section/Education';
import VolunteerExperience from './Section/VolunteerExperience';
import Skills from './Section/Skills';
import ExtracurricularActivities from './Section/ExtracurricularActivities';
import Contact from './Section/Contact';
import Hobbies from './Section/Hobbies';
import References from './Section/References';
import Certificates from './Section/Certificates';
import Awards from './Section/Awards';

import QrCode from './Section/QrCode';

import ResumeButtons from './ResumeButtons';

const PAGE_HEIGHT = 800; // Height in pixels for A4 at 96 DPI
const BOTTOM_MARGIN = 20; // Additional margin to avoid content overflow
const HEADER_HEIGHT = 92; // Approximate header height in pixels
const OUTER_PADDING = 20;

function DefaultResume({resume, user}) {

    const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);
    const url = new URL(window.location.href);
    const app_token = url.searchParams.get('token');

    const TOKEN = (localStorage.getItem('token')||app_token);

    const [loading, setLoading] = useState(false);
    const printRef = useRef(null);
    const downloadRef = useRef(null);

    const [dom, setDom] = useState(
        <div id='resumeContent' className={`${isBlackAndWhite ? 'blackAndWhite' : ''}`} ref={printRef}>
            <div className="new-page-wrapper a4 mb-3 dark_resume_content" style={{ pageBreakBefore: 'always',pageBreakAfter: 'always'}}>
                <div  className={`resume_page_block`}>

                    <div className='user_info_content section'>
                        <div className='uic_default_content section'>
                            {user && user.profile_image_visible && <div className='user_img'> <img src={resume.user_info.image} alt="" /> </div>}
                            <Contact key="contact" data={resume.user_info} position="left" />
                            <ExtracurricularActivities key="extracurricular" data={resume.extracurricular_activities} position="left" />
                            <Skills key="skills" data={resume.skills} position="left" />
                            <Hobbies key="hobbies" data={resume.hobbies} position="left" />
                        </div>

                        <div className='uic_default_right_content section'>
                            <p className='user_name'> {resume.user_info.name} </p>
                            <AboutMe key="aboutme" data={resume.objective_summary} position="right" />
                            <WorkExperience key="workexperience" data={resume.work_experience} position="right" />
                            <Education key="education" data={resume.education} position="right" />
                            <VolunteerExperience key="volunteer" data={resume.volunteer_experience} position="right" />
                            <Certificates key="certification" data={resume.certification} position="right" />
                            <Awards key="awards_achievments" data={resume.awards_achievments} position="right" />
                            <References key="references" data={resume.references} position="left" />
                            <QrCode key="qr_code" user={user} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


    useEffect(() => {
        if(dom){
            splitScreen();
        }
    }, [dom]);

    const notTag = (el) => {
        if(el.tagName.toLowerCase() === 'h2'){
            return false;
        }

        return true;
    }

    const splitScreen = () => {
        if(dom){

            const Html = dom.ref.current.children;

            const elements = $(Html).clone();
            const qrHtml = elements.find('.qr-block').html();

            const W = createCustomElement('div');

            var i = 0;
            var pageCreate = false;
            var LEFT_CONTENT_HEIGHT = 0;
            var RIGHT_CONTENT_HEIGHT = 0;
            while(i < 5){
                const pageWrapper = createCustomElement(Html[0]);
                if(!pageCreate){

                    $(Html).find('.qr-block').remove();

                    Array.from(Html).map(el => {
                        Array.from(el.children).map(el => {
                            const mainDiv = createCustomElement(el);

                            Array.from(el.children).map(el => {

                                if($(el).hasClass('cr_top_row')){
                                    LEFT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                    RIGHT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                    $(mainDiv).append(el.cloneNode(true));
                                    el.remove();
                                }else{
                                    LEFT_CONTENT_HEIGHT += 15;
                                    RIGHT_CONTENT_HEIGHT += 15;
                                    const subDiv = createCustomElement(el);
                                    Array.from(el.children).map(el => {
                                        if($(el).hasClass('uic_default_content')){

                                            if(!pageCreate){
                                                const Parent = createCustomElement(el);
                                                Array.from(el.children).map(el => {
                                                    if(!pageCreate){
                                                        if((getAbsoluteHeight(el)+LEFT_CONTENT_HEIGHT) > PAGE_HEIGHT){
                                                            const DIV = createCustomElement(el);

                                                            Array.from(el.children).map(el => {

                                                                if(!pageCreate){
                                                                    if((getAbsoluteHeight(el) + LEFT_CONTENT_HEIGHT) >= PAGE_HEIGHT){

                                                                        if(el.children.length > 0 && $(el).hasClass('voln') && notTag(el)){
                                                                            const SMALLDIV = createCustomElement(el);
                                                                            Array.from(el.children).map(el => {
                                                                                if((getAbsoluteHeight(el) + LEFT_CONTENT_HEIGHT) >= PAGE_HEIGHT){
                                                                                    pageCreate = true;
                                                                                    return;
                                                                                }else{
                                                                                    $(SMALLDIV).append(el.cloneNode(true));
                                                                                    LEFT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                                                                    el.remove();
                                                                                }
                                                                            });

                                                                            if(SMALLDIV.children.length > 0){
                                                                                $(DIV).append(SMALLDIV.cloneNode(true));
                                                                            }

                                                                            if(el.children.length <= 0){
                                                                                el.remove();
                                                                            }
                                                                        }else{
                                                                            pageCreate = true;
                                                                            return;
                                                                        }


                                                                    }else{
                                                                        $(DIV).append(el.cloneNode(true));
                                                                        LEFT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                                                        el.remove();
                                                                    }
                                                                }

                                                            });

                                                            if(DIV.children.length > 0){
                                                                $(Parent).append(DIV.cloneNode(true));
                                                            }

                                                            if(el.children.length <= 0){
                                                                el.remove();
                                                            }

                                                        }else{
                                                            LEFT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                                            $(Parent).append(el.cloneNode(true));
                                                            el.remove();
                                                        }
                                                    }
                                                });

                                                $(subDiv).append(Parent.cloneNode(true));

                                                if(el.children.length <= 0){
                                                    el.remove();
                                                }
                                            }

                                            pageCreate = false
                                        }else{

                                            if(!pageCreate){

                                                if($(subDiv).find('.uic_default_content').length <= 0){
                                                    const Parent = createCustomElement('<div class="uic_default_content"><div>');
                                                    $(Parent).append('<div></div>');
                                                    $(subDiv).append(Parent.cloneNode(true));
                                                }

                                                const Parent = createCustomElement(el);
                                                Array.from(el.children).map(el => {
                                                    if(!pageCreate){

                                                        if((getAbsoluteHeight(el)+RIGHT_CONTENT_HEIGHT) > PAGE_HEIGHT){
                                                            const DIV = createCustomElement(el);

                                                            if(!pageCreate){
                                                                Array.from(el.children).map(el => {

                                                                    if(!pageCreate){
                                                                        if((getAbsoluteHeight(el) + RIGHT_CONTENT_HEIGHT) >= PAGE_HEIGHT){
                                                                            if(el.children.length > 0 && notTag(el)){
                                                                                const minorDIV = createCustomElement(el);
                                                                                Array.from(el.children).map(el => {
                                                                                    if((getAbsoluteHeight(el) + RIGHT_CONTENT_HEIGHT) >= PAGE_HEIGHT){
                                                                                        pageCreate = true;
                                                                                        return;
                                                                                    }else{
                                                                                        $(minorDIV).append(el.cloneNode(true));
                                                                                        RIGHT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                                                                        el.remove();
                                                                                    }
                                                                                });

                                                                                $(DIV).append(minorDIV.cloneNode(true));
                                                                                if(el.children.length <= 0){
                                                                                    el.remove();
                                                                                }
                                                                            }else{
                                                                                pageCreate = true;
                                                                                return;
                                                                            }
                                                                        }else{
                                                                            $(DIV).append(el.cloneNode(true));
                                                                            RIGHT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                                                            el.remove();
                                                                        }
                                                                    }

                                                                });
                                                            }


                                                            if(DIV.children.length > 0){
                                                                $(Parent).append(DIV.cloneNode(true));
                                                            }

                                                            if(el.children.length <= 0){
                                                                el.remove();
                                                            }


                                                        }else{
                                                            RIGHT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                                            $(Parent).append(el.cloneNode(true));
                                                            el.remove();
                                                        }
                                                    }
                                                });

                                                $(subDiv).append(Parent.cloneNode(true));

                                                if(el.children.length <= 0){
                                                    el.remove();
                                                }
                                            }
                                        }
                                    })

                                    if($(subDiv).find('.uic_default_right_content').length <= 0){
                                        const Parent = createCustomElement('<div class="uic_default_right_content"><div>');
                                        $(Parent).append('<div></div>');
                                        $(subDiv).append(Parent.cloneNode(true));
                                    }

                                    if($(subDiv).length > 0){
                                        $(mainDiv).append(subDiv.cloneNode(true));
                                    }

                                    if(el.children.length <= 0){
                                        el.remove();
                                    }
                                }
                            })

                            if(mainDiv.children.length > 0){
                                $(mainDiv).append(qrHtml);
                                $(pageWrapper).append(mainDiv.cloneNode(true));
                            }
                        })
                    });

                    if(pageWrapper.children.length > 0){
                        $(W).append(pageWrapper);
                    }

                    RIGHT_CONTENT_HEIGHT = 0;
                    LEFT_CONTENT_HEIGHT = 0;

                    pageCreate = false;
                }
                i++;
            }

            if(W.children.length > 0){
                $(Html).parent('div').html($(W).html());
            }


        }
    }

    function getAbsoluteHeight(el) {
        // Get the DOM Node if you pass in a string
        el = (typeof el === 'string') ? document.querySelector(el) : el;

        var styles = window.getComputedStyle(el);
        var margin = parseFloat(styles['marginTop']) +
                     parseFloat(styles['marginBottom']);

        return Math.ceil(el.offsetHeight + margin);
    }

    function createCustomElement(element){
        // create Element
        var elm = document.createElement(element.tagName);

        if($(element).attr('class')!='' && $(element).attr('class')!== undefined) {
            elm.setAttribute('class', $(element).attr('class'));
        }


        if($(element).attr('style')!='' && $(element).attr('style')!== undefined) {
            elm.setAttribute('style', $(element).attr('style'));
        }

        if($(element).attr('id')!='' && $(element).attr('id')!== undefined) {
            elm.setAttribute('id', $(element).attr('id'));
        }

        return elm;
    }

    const handleToggleMode = (mode) => {
        setIsBlackAndWhite(mode === 'blackAndWhite');
    };

    const handleDownload = async () => {
        setLoading(true);
        const element = downloadRef.current;

        // Extract the HTML content as a string
        const htmlContent = element.outerHTML;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "htmlContent": htmlContent
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/generate-pdf`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob(); // Get the response as a Blob
        })
        .then((blob) => {
            const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
            const a = document.createElement('a'); // Create a new anchor element
            a.href = url;
            a.download = `${resume.user_info.name}.pdf`; // Set the default file name
            document.body.appendChild(a);
            a.click(); // Programmatically click the anchor to trigger the download
            a.remove(); // Clean up and remove the anchor from the DOM
        })
        .catch((error) => console.error(error))
        .finally(() => { setLoading(false)});
    };


    return(
        <>
            <div className='common_background_block'>

                <ResumeButtons isBlackAndWhite={isBlackAndWhite} handleToggleMode={handleToggleMode} handleDownload={handleDownload} loading={loading}  user={user} />

                <div className={`cv-wrapper ${isBlackAndWhite ? 'blackAndWhite' : ''}`} ref={downloadRef}>
                    <div className='cv-inner-style'>
                        {dom}
                    </div>
                </div>

            </div>
        </>
    )
}

export default DefaultResume;