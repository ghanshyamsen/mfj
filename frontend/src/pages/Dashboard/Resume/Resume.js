import React, {useState, useEffect} from 'react';
import { useParams  } from 'react-router-dom';

import DefaultResume from './DefaultResume';
import ClassicResume from './ClassicResume';
import DarkResume from './DarkResume';
import ModernEdge from './ModernEdge';
import VibrantFlow from './VibrantFlow';
import BoldContrast from './BoldContrast';
import CreativeGrid from './CreativeGrid';
import ProfessionalYellow from './ProfessionalYellow';
import ElegantCurve from './ElegantCurve';
import FriendlyProfile from './FriendlyProfile';
import TestResume from './TestResume';





function Resume() {
    const { key, user, token} = useParams();

    const url = new URL(window.location.href);
    const app_token = url.searchParams.get('token');

    const TOKEN = (localStorage.getItem('token')||app_token);

    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState({});
    const [userinfo, setUserinfo] = useState(JSON.parse(localStorage.getItem('userData')));

    useEffect(() => {

        // if(!userinfo?.purchased_templates.includes(key)){
        //     window.history.back();
        // }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-resume-builder${user?'/'+user:''}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setResume(result.data)
                setLoading(true);
            }
        })
        .catch((error) => console.error(error.message));

        if(user){

            fetch(`${process.env.REACT_APP_API_URL}/app/get-profile/${user}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.status){
                    setUserinfo(result.data)
                }
            })
            .catch((error) => console.error(error.message));
        }

        updateTheame()
    },[])

    const updateTheame = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "resume_theame": key
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-resume`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
        })
        .catch((error) => console.error(error.message));
    }

    switch (key) {

        case "test":
            return loading && userinfo && <TestResume resume={resume} user={userinfo} />
        break;

        case "default":
            return loading && userinfo && <DefaultResume resume={resume} user={userinfo} />
        break;

        case "classic":
            return loading && userinfo &&  <ClassicResume resume={resume} user={userinfo} />
        break;

        case "dark":
            return loading && userinfo &&  <DarkResume resume={resume} user={userinfo} />
        break;

        case "modernedge":
            return loading && userinfo &&  <ModernEdge resume={resume} user={userinfo} />
        break;

        case "vibrantflow":
            return loading && userinfo &&  <VibrantFlow resume={resume} user={userinfo} />
        break;

        case "boldcontrast":
            return loading && userinfo &&  <BoldContrast resume={resume} user={userinfo} />
        break;

        case "creativegrid":
            return loading && userinfo &&  <CreativeGrid resume={resume} user={userinfo} />
        break;

        case "professionalyellow":
            return loading && userinfo &&  <ProfessionalYellow resume={resume} user={userinfo} />
        break;

        case "elegantcurve":
            return loading && userinfo &&  <ElegantCurve resume={resume} user={userinfo} />
        break;

        case "friendlyprofile":
            return loading && userinfo &&  <FriendlyProfile resume={resume} user={userinfo} />
        break;

        default:
            return loading && userinfo &&  <DefaultResume resume={resume} user={userinfo}/>
        break;
    }

}

export default Resume;