import React, { useState, useEffect, useRef } from 'react';
import $ from "jquery";

/* Section Imports */
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

 // Height in pixels for A4 at 96 DPI
const BOTTOM_MARGIN = 25; // Additional margin to avoid content overflow
const HEADER_HEIGHT = 163; // Approximate header height in pixels
const OUTER_PADDING = 16;
const PAGE_HEIGHT = 820;
const DefaultResume = ({ resume, user }) => {
    const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);
    const [loading, setLoading] = useState(false);
    const printRef = useRef(null);
    const downloadRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const url = new URL(window.location.href);
    const app_token = url.searchParams.get('token');

    const TOKEN = (localStorage.getItem('token')||app_token);


    const Header = ({ data }) => (
        <div className='user_block'>
            {user && user.profile_image_visible && <div className='user_img'>
                <img src={data.image || user} alt="User" />
            </div>}
            <p className='mb-0 user_name'>{data.name}</p>
        </div>
    );

    const [dom, setDom] = useState(
        <div id='resumeContent' ref={printRef}>
            <div className="new-page-wrapper a4 mb-3 default_resume_content" style={{ pageBreakBefore: 'always',pageBreakAfter: 'always'}}>
                <div  className={`resume_page_block`}>
                    <Header data={resume.user_info} />
                    <div className='user_info_content section'>
                        <div className='uic_default_content section'>
                            <Contact key="contact" data={resume.user_info} position="left" />
                            <ExtracurricularActivities key="extracurricular" data={resume.extracurricular_activities} position="left" />
                            <Skills key="skills" data={resume.skills} position="left" />
                            <Hobbies key="hobbies" data={resume.hobbies} position="left" />
                        </div>

                        <div className='uic_default_right_content section'>
                            <AboutMe key="aboutme" data={resume.objective_summary} position="right" className={isDownloading ? 'active-class' : ''}  showEditIcon={isDownloading}/>
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
            const W = createCustomElement('div');
            const qrHtml = elements.find('.qr-block').html();

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
                                if($(el).hasClass('user_block')){
                                    LEFT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                    RIGHT_CONTENT_HEIGHT += getAbsoluteHeight(el);
                                    $(mainDiv).append(el.cloneNode(true));
                                    el.remove();
                                }else{

                                    LEFT_CONTENT_HEIGHT += (0 + 0);
                                    RIGHT_CONTENT_HEIGHT += (24 + 16);

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

                                    if(subDiv.children.length > 0){
                                        $(mainDiv).append(subDiv.cloneNode(true));
                                    }



                                    if(el.children.length <= 0){
                                        el.remove();
                                    }

                                }
                            })

                            if(mainDiv.children.length > 0){
                                $(mainDiv).append(qrHtml).removeClass('qr-block');
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
        var elm = document.createElement(element.tagName||'div');

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
        console.log("Before setting isDownloading: ", isDownloading);

        setIsDownloading(true);
        setLoading(true);
        console.log("Before setting setLoading: ", loading);

        setTimeout(async () => {
            console.log("After setting isDownloading (in timeout): ", isDownloading);

            // if (isDownloading) {
                const element = downloadRef.current;
                console.log(element);
                const htmlContent = element.outerHTML;

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Bearer ${TOKEN}`);

                const raw = JSON.stringify({ "htmlContent": htmlContent });

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
                    return response.blob();
                })
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${resume.user_info.name}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setLoading(false);
                    setIsDownloading(false);
                });
            // }


        }, 1000);
    };




    return (
        <>
            <div className='common_background_block'>
                <ResumeButtons isBlackAndWhite={isBlackAndWhite} handleToggleMode={handleToggleMode} handleDownload={handleDownload} loading={loading} user={user}  />

                <div className={`cv-wrapper ${isBlackAndWhite ? 'blackAndWhite' : ''}`} ref={downloadRef}>
                    <div className='cv-inner-style'>
                        {/* dom */}
                        {dom}
                    </div>
                </div>

            </div>
        </>
    );
};

export default DefaultResume;
