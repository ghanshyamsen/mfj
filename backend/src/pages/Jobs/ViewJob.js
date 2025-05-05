/* eslint-disable no-unreachable */
import React , { useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, Label } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useParams, useNavigate, Link } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const ManageJob = () => {

  document.title ="Manage Job | "+process.env.REACT_APP_SITE_NAME;

  const { key:Id } = useParams();

  const history = useNavigate();

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [options, setOptions] = useState([]);
  const [company, setCompany] = useState({});
  const [reports, setReports] = useState([]);
  const [application, setApplications] = useState([]);

  const populateFromData = async (data) => {
    setFormData(data);
    setData(data);
  }

  useEffect(() => {

    if(Id){
      fetchData();
      fetchReport();
      fetchApplication();
    }else{
      populateFromData({
        user_id:"",
        job_position:"",
        orgnaization:"",
        job_descrition:"",
        job_min_amount:"",
        job_max_amount:""
      });
    }
  }, []);


  const fetchOptions = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/user/get/0/manager`);
      if(response.status === "success") {
        const dataArray = response.data;
        setOptions(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/job/get/${Id}`);
      if(response.status === "success") {
        const dataArray = response.data;
        populateFromData(dataArray);
        fetchCompany(dataArray.user_id)
      }else{
        window.notify('error','Invalid job request.');
        history('/job/master-list');

      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompany = async (Id) => {
    const response = await api.get(`${process.env.REACT_APP_API_URL}/app/get-company/${Id}`);

    if(response.status) {
      setCompany(response.data);
    }

  }

  const fetchReport = async () => {
    const response = await api.get(`${process.env.REACT_APP_API_URL}/app/get-reports?job=${Id}`);

    if(response.status) {
      setReports(response.data);
    }
  }

  const fetchApplication = async () => {
    const response = await api.get(`${process.env.REACT_APP_API_URL}/app/get-applied-job?job=${Id}`);

    if(response.status) {
      setApplications(response.data);
    }
  }

  console.log(formData);

  document.title = `View Job | ${process.env.REACT_APP_SITE_NAME}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <BreadCrumb title="View Job" pageTitle="" />

          <Row>

            <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="p-2 mt-4">

                    <div className="form-group mb-3" key="logo">
                      <Label htmlFor="logo" className="form-label">Image</Label>
                      {
                        // eslint-disable-next-line
                        (typeof company.company_logo === 'string' && company.company_logo && company.company_logo!=="" && company.company_logo!=="null")?<div style={{width:"200px"}} className="p-2 m-1 rounded-3 bg-dark"><img src={`${company.company_logo}`} className="w-100" /></div>:null
                      }
                    </div>

                    <Row>
                      <Col xs={4}>
                        <div className="form-group mb-3" key="job_position">
                          <Label htmlFor="job_position" className="form-label">Job Position</Label>
                          <p>{formData.job_position || ''}</p>
                        </div>

                        <div className="form-group mb-3" key="orgnaization">
                          <Label htmlFor="orgnaization" className="form-label">Organization</Label>
                          <p>{company.business_type||''}</p>
                        </div>

                        <div className="form-group mb-3" key="Location Type">
                          <Label htmlFor="Location Type" className="form-label">Job Location Type</Label>
                          <p>{formData.job_location_type || ''}</p>
                        </div>

                        {formData.job_location_type ==='In-person at a precise location' && <div className="form-group mb-3" key="location">
                          <Label htmlFor="location" className="form-label">Job Location</Label>
                          <p>{formData.location || 'N/A'}</p>
                        </div>}

                        {formData.job_location_type ==='In-person at a precise location' && <div className="form-group mb-3" key="Geo-location">
                          <Label htmlFor="Geo-location" className="form-label">Geo-location matching</Label>
                          <p>{(formData.location_miles ? formData.location_miles + ' Miles' : '') || 'Anywhere from the location'}</p>
                        </div>}


                        <div className="form-group mb-3" key="Authorization">
                          <Label htmlFor="Authorization" className="form-label">Work Authorization Requirement</Label>
                          <p>{formData.work_authorization_requirement || ''}</p>
                        </div>

                        <div className="form-group mb-3" key="Job Type">
                          <Label htmlFor="Job Type" className="form-label">Job Type</Label>
                          <p>{formData.job_type || ''}</p>
                        </div>
                      </Col>

                      <Col xs={4}>

                        <div className="form-group mb-3" key="Experience Level">
                          <Label htmlFor="Experience Level" className="form-label">Experience Level</Label>
                          <p>{formData.job_experience_level || ''}</p>
                        </div>

                        <div className="form-group mb-3" key="Weekly Day Range">
                          <Label htmlFor="Weekly Day Range" className="form-label">Weekly Day Range</Label>
                          <p>{formData.weekly_day_range || ''}</p>
                        </div>

                        {formData.weekly_day_range === 'Other' && <div className="form-group mb-3" key="Other Weekly Day">
                          <Label htmlFor="Other Weekly Day" className="form-label">Other Weekly Day</Label>
                          <p>{formData.weekly_day_range_other || ''}</p>
                        </div>}

                        <div className="form-group mb-3" key="Shift Type">
                          <Label htmlFor="Shift Type" className="form-label">Shift Type</Label>
                          <p>{formData.shift_time || ''}</p>
                        </div>

                        {formData.shift_time === 'Other' && <div className="form-group mb-3" key="Other Shift">
                          <Label htmlFor="Other Shift" className="form-label">Other Shift</Label>
                          <p>{formData.other_shift_time || ''}</p>
                        </div>}

                        <div className="form-group mb-3" key="Expected Hours">
                          <Label htmlFor="Expected Hours" className="form-label">Expected Hours</Label>
                          <p>{formData.expected_hours || ''}</p>
                        </div>

                        <div className="form-group mb-3" key={formData.expected_hours}>
                          <Label htmlFor={formData.expected_hours} className="form-label">{formData.expected_hours}</Label>
                          <p>{formData.expected_min_hour || ''} {formData.expected_max_hour?'- '+formData.expected_max_hour:''}</p>
                        </div>


                      </Col>

                      <Col xs={4}>
                        <div className="form-group mb-3" key="Pay Type">
                          <Label htmlFor="Pay Type" className="form-label">Pay Type</Label>
                          <p>{formData.job_pay_type || ''}</p>
                        </div>

                        {formData.job_pay_type === 'Other' && <div className="form-group mb-3" key="Other Pay Type">
                          <Label htmlFor="Other Pay Type" className="form-label">Other Pay Type</Label>
                          <p>{formData.job_pay_type_other || ''}</p>
                        </div>}

                        <div className="form-group mb-3" key="Pay Frequency">
                          <Label htmlFor="Pay Frequency" className="form-label">Pay Frequency</Label>
                          <p>{formData.job_pay_frequency || ''}</p>
                        </div>

                        <div className="form-group mb-3" key="Benefits">
                          <Label htmlFor="Benefits" className="form-label">Benefits</Label>
                          <p>{formData?.job_benefits?.filter(value => value !== 'Other').join(', ') || ''}</p>
                        </div>

                        {formData?.job_benefits_other && <div className="form-group mb-3" key="Other Benefits">
                          <Label htmlFor="Other Benefits" className="form-label">Other Benefits</Label>
                          <p>{formData.job_benefits_other}</p>
                        </div>}

                        <div className="form-group mb-3" key="job_min_amount">
                          <Label htmlFor="job_min_amount" className="form-label">Min Amount ($) - Max Amount ($)</Label>
                          <p>{(((formData.job_min_amount?'$'+((formData.job_min_amount||0).toLocaleString('en-US')):'')+(formData.job_max_amount?'- $'+((formData.job_max_amount||0).toLocaleString('en-US')):'')))}</p>
                        </div>


                        <div className="form-group mb-3" key="Competitive Pay">
                          <Label htmlFor="Competitive Pay" className="form-label">Competitive Pay</Label>
                          <p>{formData.pay_is_competitive || ''}</p>
                        </div>
                      </Col>

                    </Row>

                    <hr/>
                    <h6>Candidate Preferences:</h6>
                    <Row>
                      <div className="form-group mb-3 col-sm-4" key="Education Level">
                        <Label htmlFor="Education Level" className="form-label">Education Level</Label>
                        <p>{formData.education_level || ''}</p>
                      </div>

                      {/* <div className="form-group mb-3 col-3" key="Years of Experience">
                        <Label htmlFor="Years of Experience" className="form-label">Years of Experience</Label>
                        <p>{formData.year_of_experience || ''}</p>
                      </div> */}

                      <div className="form-group mb-3 col-sm-4" key="Required Skills/Certifications">
                        <Label htmlFor="Required Skills/Certifications" className="form-label">Required Skills/Certifications</Label>
                        <p>{formData?.required_skills?.join(', ') || ''}</p>
                      </div>

                      <div className="form-group mb-3 col-sm-4" key="Other">
                        <Label htmlFor="Other" className="form-label">Other</Label>
                        <p>{formData?.other_preferences}</p>
                      </div>
                    </Row>
                    <hr/>
                    <h6>Job Description:</h6>
                    <div className="form-group mb-3" key="job_description">
                      <p style={{whiteSpace:'break-spaces'}}>{formData.job_description}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {reports.length > 0 && <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="p-2 mt-4">
                    <h3>Job Reports</h3> <hr/>
                    {
                      reports.map((report, index) => (
                        <div key={index}>
                          <div className="form-group mb-3">
                            <Label className="form-label"> {index+1}). Report By</Label>
                            <Link to={`/view-user/${report.candidate_id}`}><p>{report.user_info.first_name} {report.user_info.last_name}</p></Link>
                          </div>
                          <div className="form-group mb-3">
                            <Label className="form-label">Report Reason</Label>
                            <p>{report.report_reason.join(', ')}</p>
                          </div>
                          {report.report_reason_description && <div className="form-group mb-3">
                            <Label className="form-label">Report Description</Label>
                            <p style={{whiteSpace:'break-spaces'}}>{report.report_reason_description}</p>
                          </div>}
                        </div>
                      ))
                    }
                  </div>
                </CardBody>
              </Card>
            </Col>}

            {application.length > 0 && <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="p-2 mt-4">
                    <h3>Job Application's</h3> <hr/>
                    {
                      application.map((value, index) => (
                        <>
                          {index > 0 && <hr/>}
                          <div key={index}>
                            <div className="form-group mb-3">
                              <Label className="form-label"> {index+1}). Applicant Name</Label>
                              <Link to={`/view-user/${value.candidate_id}`}><p>{value.user_info.first_name} {value.user_info.last_name}</p></Link>
                            </div>
                            {value.cover_letter && <div className="form-group mb-3">
                              <Label className="form-label">Cover Letter</Label>
                              <p style={{whiteSpace:'break-spaces'}}>{value.cover_letter}</p>
                            </div>}

                            {value.status && <div className="form-group mb-3">
                              <Label className="form-label">Status</Label>
                              <p style={{color:`${((value.status.toLowerCase()=='pending'?'#ED9B44':(value.status.toLowerCase()=='refused')?'#FF453A':'#51B73B'))}`}}>{value.status}</p>
                            </div>}
                          </div>
                        </>
                      ))
                    }
                  </div>
                </CardBody>
              </Card>
            </Col>}

          </Row>
        </Container>
      </div>
    </React.Fragment>
  );

};

export default ManageJob;