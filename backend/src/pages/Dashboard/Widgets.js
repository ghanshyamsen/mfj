import React, { useEffect, useMemo, useState } from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';

import { APIClient, setAuthorization, getLoggedinUser } from "../../helpers/api_helper";
const api = new APIClient();

const Widgets = () => {
    const [WidgetsList, setWidgetsList] = useState([
        {
            'key':"faqcat",
            'label':"Faq Categories",
            'color':"success",
            'icon':"ri-question-line",
            'counter': 0,
            'link':"Go to faq category",
            'url':"/faq-category/master-list",
            'bgcolor':"success"
        },
        {
            'key':"faqs",
            'label':"Faq's",
            'color':"success",
            'icon':"ri-question-line",
            'counter':0,
            'link':"Go to faq's",
            'url':"/faq/master-list",
            'bgcolor':"success"
        },
        {
            'key':"tutorialcat",
            'label':"Tutorial Categories",
            'color':"warning",
            'icon':"las la-chalkboard-teacher",
            'counter':0,
            'link':"Go to tutorial categories",
            'url':"/tutorial-category/master-list",
            'bgcolor':"warning"
        },
        {
            'key':"tutorials",
            'label':"Tutorials",
            'color':"warning",
            'icon':"las la-chalkboard-teacher",
            'counter':0,
            'link':"Go to tutorial",
            'url':"/tutorial/master-list",
            'bgcolor':"warning"
        },
        {
            'key':"teenager",
            'label':"Teenager",
            'color':"info",
            'icon':"bx bx-user-circle",
            'counter':0,
            'link':"Go to teenager",
            'url':"/users/teenager",
            'bgcolor':"info"
        },
        {
            'key':"manager",
            'label':"Manager",
            'color':"info",
            'icon':"ri-user-2-fill",
            'counter':0,
            'link':"Go to manager",
            'url':"/users/manager",
            'bgcolor':"info"
        },
        {
            'key':"parents",
            'label':"Parents",
            'color':"info",
            'icon':"ri-parent-line",
            'counter':0,
            'link':"Go to parents",
            'url':"/users/parents",
            'bgcolor':"info"
        },
        {
            'key':"objective",
            'label':"Objective & Summary",
            'color':"primary",
            'icon':"ri-questionnaire-line",
            'counter':0,
            'link':"Go to objective questions",
            'url':"/objective-questions",
            'bgcolor':"primary"
        },
        {
            'key':"skills",
            'label':"Skills",
            'color':"secondary",
            'icon':"las la-tools",
            'counter':0,
            'link':"Go to skills",
            'url':"/skills/master-list",
            'bgcolor':"secondary"
        },
        {
            'key':"skillassestment",
            'label':"Skills Assessment",
            'color':"secondary",
            'icon':"ri-task-line",
            'counter':0,
            'link':"Go to skills assessment",
            'url':"/skills/assessment-list",
            'bgcolor':"secondary"
        },
        {
            'key':"volunteerskill",
            'label':"Volunteer Skills",
            'color':"secondary",
            'icon':"ri-todo-line",
            'counter':0,
            'link':"Go to volunteer skills",
            'url':"/skills/volunteer-list",
            'bgcolor':"secondary"
        },
        {
            'key':"school",
            'label':"School List",
            'color':"danger",
            'icon':"bx bxs-school",
            'counter':0,
            'link':"Go to school list",
            'url':"/education/school-list",
            'bgcolor':"danger"
        },
        {
            'key':"academic",
            'label':"Academic List",
            'color':"danger",
            'icon':"las la-certificate",
            'counter':0,
            'link':"Go to academic list",
            'url':"/education/academic-list",
            'bgcolor':"danger"
        },
        {
            'key':"coursework",
            'label':"Coursework List",
            'color':"danger",
            'icon':"las la-graduation-cap",
            'counter':0,
            'link':"Go to coursework list",
            'url':"/education/coursework-list",
            'bgcolor':"danger"
        },
        {
            'key':"extraactivitiescategory",
            'label':"Extracurricular Activities Category",
            'color':"body-secondary",
            'icon':"bx bx-run",
            'counter':0,
            'link':"Go to extracurricular activities categories",
            'url':"/activitie-category/master-list",
            'bgcolor':"body-secondary text-opacity-25"
        },
        {
            'key':"extraactivities",
            'label':"Extracurricular Activities",
            'color':"body-secondary",
            'icon':"bx bx-run",
            'counter':0,
            'link':"Go to extracurricular activities",
            'url':"/activitie/master-list",
            'bgcolor':"body-secondary text-opacity-25"
        },
        {
            'key':"hobbiescategories",
            'label':"Hobbies & Interest",
            'color':"body-secondary",
            'icon':"las la-chess",
            'counter':0,
            'link':"Go to hobbies categories",
            'url':"/hobbies-category/master-list",
            'bgcolor':"body-secondary text-opacity-25"
        },
        {
            'key':"hobbies",
            'label':"Hobbies & Interest",
            'color':"body-secondary",
            'icon':"las la-chess",
            'counter':0,
            'link':"Go to hobbies",
            'url':"/hobbies/master-list",
            'bgcolor':"body-secondary text-opacity-25"
        },
        {
            'key':"jobs",
            'label':"Jobs",
            'color':"success",
            'icon':"ri-briefcase-line",
            'counter':0,
            'link':"Go to jobs",
            'url':"/job/master-list",
            'bgcolor':"success"
        },
        {
            'key':"jobsuggestions",
            'label':"Job Suggestions",
            'color':"success",
            'icon':"ri-briefcase-line",
            'counter':0,
            'link':"Go to job suggestions",
            'url':"/job/suggestions",
            'bgcolor':"success"
        },
        {
            'key':"careerlist",
            'label':"Career List",
            'color':"success",
            'icon':"ri-briefcase-line",
            'counter':0,
            'link':"Go to career list",
            'url':"/career/master-list",
            'bgcolor':"success"
        },
        {
            'key':"starterjobs",
            'label':"Starter Jobs",
            'color':"success",
            'icon':"ri-briefcase-line",
            'counter':0,
            'link':"Go to starter jobs",
            'url':"/starter-jobs",
            'bgcolor':"success"
        },
        {
            'key':"personalityprofile",
            'label':"Personality Profile",
            'color':"success",
            'icon':"ri-file-list-3-line",
            'counter':0,
            'link':"Go to personality profile",
            'url':"/personality-profile",
            'bgcolor':"success"
        },
        {
            'key':"employersassessments",
            'label':"Employers Assessments",
            'color':"success",
            'icon':"ri-file-list-3-line",
            'counter':0,
            'link':"Go to employers assessments",
            'url':"/employers-assessments",
            'bgcolor':"success"
        },
        {
            'key':"employeesassessments",
            'label':"Employees Assessments",
            'color':"success",
            'icon':"ri-file-list-3-line",
            'counter':0,
            'link':"Go to employees assessments",
            'url':"/employees-assessments",
            'bgcolor':"success"
        },
        {
            'key':"categorylist",
            'label':"Article Categories",
            'color':"success",
            'icon':"ri-picture-in-picture-exit-line",
            'counter':0,
            'link':"Go to article category",
            'url':"/article-category/list",
            'bgcolor':"success"
        },
        {
            'key':"articleslist",
            'label':"Articles",
            'color':"success",
            'icon':"ri-picture-in-picture-exit-line",
            'counter':0,
            'link':"Go to article",
            'url':"/articles/list",
            'bgcolor':"success"
        }
    ]);
    const user = getLoggedinUser();
    setAuthorization(user.token);
    useEffect(() => {

        fetchData();
        // eslint-disable-next-line
      }, [!WidgetsList]);

    const fetchData = async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/index/dashboard`);
            setWidgetsList(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <React.Fragment>
            {WidgetsList.map((item, key) => (
                <Col xl={3} md={6} key={key}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                </div>
                                <div className="flex-shrink-0">
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                    <span className="counter-value" data-target={item.counter}>
                                        <CountUp
                                            start={0}
                                            prefix=""
                                            suffix={item.counter > 999?'K':''}
                                            separator=','
                                            end={(item.counter>999?((item.counter)/1000):item.counter)}
                                            decimals={0}
                                            duration={1}
                                        />
                                    </span></h4>
                                    <Link to={item.url} className="text-decoration-underline">{item.link}</Link>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded fs-3 bg-soft-" + item.bgcolor}>
                                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>))}
        </React.Fragment>
    );
};

export default Widgets;