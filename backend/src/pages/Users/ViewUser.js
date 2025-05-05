import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, DropdownItem, Button, DropdownMenu, DropdownToggle, Input, Label, Nav, NavItem, NavLink, Pagination, PaginationItem, PaginationLink, Progress, Row, TabContent, Table, TabPane, UncontrolledCollapse, UncontrolledDropdown } from 'reactstrap';
import classnames from 'classnames';
import { Link, useParams, useNavigate } from "react-router-dom";
import $ from "jquery";

import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useSelector, useDispatch } from "react-redux";

//Images
import profileBg from '../../assets/images/profile-bg.jpg';
import avatar1 from '../../assets/images/users/default-user.png';
import Downloads from '../../assets/images/downloads.png';


import { APIClient } from "../../helpers/api_helper";
const api = new APIClient();

const ViewUser = () => {

  document.title ="View User | "+process.env.REACT_APP_SITE_NAME;

  const { key:uid } = useParams();

  const [ user, setUser ] = useState({
    name: "",
    email: "",
    phone_number: "",
    location: "",
    join_date: "",
    html: "",
    profile_image:avatar1,
    einnumber:"",
    user_type:"",
    business_type:"",
    employer_type:"",
    business_document:""
  });

  const [resume, setResume] = useState(null);
  const [txn, setTxn] = useState([]);

  useEffect(() => {
    fetchData();
    fetchBuilder();
    fetchTxn();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/user/get/${uid}`);
      if(response.status === "success") {
        setUser({
          name: response.data.name,
          email: response.data.email,
          phone_number: (response.data.phone_number || 'N/A'),
          location: response.data.location,
          join_date: response.data.join_date,
          html: response.data.html,
          profile_image: response.data.profile_image,
          einnumber: response.data.business_ein_number,
          user_type: response.data.user_type,
          business_type: response.data.business_type,
          employer_type: response.data.employer_type,
          approval_status: response.data?.approval_status,
          job_count: response.data?.job_count,
          business_document: response.data?.business_document,
          location_miles: response.data?.location_miles,
          pronouns: response.data?.pronouns,
          google_connect: response.data?.google_connect,
          linkedin_connect: response.data?.linkedin_connect,
          ...response.data
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchBuilder = async () => {
    const response = await api.get(`${process.env.REACT_APP_API_URL}/app/get-resume-builder/${uid}`);

    if(response.status){
      setResume(response.data);
    }
  }

  const Approved = async () => {

    try {
      const response = await api.update(`${process.env.REACT_APP_API_URL}/user/update/${uid}`,{
        approval_status:true
      });

      if(response.status === "success") {
        setUser({...user, ['approval_status']:true});
        window.notify('success','Approved sucessfully.')
      }

    } catch (error) {
      console.error(error.message);
    }
  }

  const FileDownloadLink = ({ file }) => {

      const fileUrl = `${process.env.REACT_APP_MEDIA_URL}documents/${file}`;

      const handleDownload = (e) => {
          e.preventDefault();
          fetch(fileUrl)
          .then(response => response.blob())
          .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = url;
              a.download = file;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
          })
          .catch(err => console.error('Download failed:', err));
      }

      return (
        <div className='ufn_right' style={{width:'15px'}}>
            <a href={fileUrl}  onClick={handleDownload}>
              <img src={Downloads} alt="Download" style={{width:'100%'}} />
            </a>
        </div>
      );
  };

  const fetchTxn = async () => {
    const response = await api.get(`${process.env.REACT_APP_API_URL}/transaction/get/${uid}`);

    if(response.status){
      setTxn(response.data);
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">

        <BreadCrumb title="View" pageTitle="" />

        <Container fluid>

          <div className="profile-foreground position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg">
              <img src={profileBg} alt="" className="profile-wid-img" />
            </div>
          </div>

          <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <Row className="g-4">
              <div className="col-auto">
                <div className="avatar-lg">
                  <img src={user.profile_image} alt="user-img" className="img-thumbnail rounded-circle" style={{width: "100%",height: "100%"}} />
                </div>
              </div>

              <Col>
                <div className="p-2">
                  <h3 className="text-white mb-1">{user.name}</h3>
                  <p className="text-white-75">{user.user_type}</p>
                  <div className="hstack text-white-50 gap-1">
                    <div className="me-2">
                      <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>{(user.location)?user.location:null}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Row>
            <Col lg={12}>
              <div>
                <div className="d-flex profile-wrapper">
                  <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                    <NavItem>
                      <NavLink href="#overview-tab">
                        <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Overview</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>

                <TabContent activeTab="1" className="pt-4">
                  <TabPane tabId="1">
                    <Row>
                      <Col xxl={12}>
                        <Card>
                          <CardBody>
                            <h5 className="card-title mb-3" style={{ fontWeight: '600', textAlign: 'left', padding: '0', paddingBottom: '10px', borderBottom: '1px dotted rgb(135, 138, 153)' }}>Info</h5>
                            {/*!user?.approval_status && user.user_type==="manager" && <Button className="btn-primary" onClick={Approved} >Approval Pending</Button>*/}

                            <div className="table-responsive">
                              <Table className="table-borderless mb-0">
                                <tbody>
                                  <tr>
                                    <th className="ps-0" scope="row" style={{width:'25%'}}>Full Name :</th>
                                    <td className="text-muted">{user.name}</td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row" style={{width:'25%'}}>Mobile :</th>
                                    <td className="text-muted">{user.phone_number}</td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row" style={{width:'25%'}}>E-mail :</th>
                                    <td className="text-muted">{user.email}</td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row" style={{width:'25%'}}>{user.user_type==="manager"?'Street Address':`Location`} :</th>
                                    <td className="text-muted">{(user.location)?user.location:'N/A'}</td>
                                  </tr>

                                  {
                                    (user.user_type==="manager") &&
                                    (
                                      <>
                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>City :</th>
                                          <td className="text-muted">{(user.city)?user.city:'N/A'}</td>
                                        </tr>

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>State :</th>
                                          <td className="text-muted">{(user.state)?user.state:'N/A'}</td>
                                        </tr>

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Zip Code :</th>
                                          <td className="text-muted">{(user.zip_code)?user.zip_code:'N/A'}</td>
                                        </tr>
                                      </>
                                    )
                                  }

                                  {
                                    (user.user_type==="teenager") &&
                                    (
                                      <>
                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Location Radius</th>
                                          <td className="text-muted">{user?.location_miles && user.location_miles!=='Anywhere from the location'?`${user.location_miles} Miles`:(user?.location_miles||'N/A')}</td>
                                        </tr>
                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Preferred pronouns</th>
                                          <td className="text-muted">{user.pronouns||'N/A'}</td>
                                        </tr>
                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Google Linked</th>
                                          <td className="text-muted">{user.google_connect?'Yes':'No'}</td>
                                        </tr>

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Linkedin Linked</th>
                                          <td className="text-muted">{user.linkedin_conect?'Yes':'No'}</td>
                                        </tr>
                                      </>
                                    )
                                  }

                                  <tr>
                                    <th className="ps-0" scope="row" style={{width:'25%'}}>Joining Date</th>
                                    <td className="text-muted">{user.join_date}</td>
                                  </tr>
                                  {
                                    (user.user_type==="manager") &&
                                    (
                                      <>

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Business Name</th>
                                          <td className="text-muted">{user.business_type}</td>
                                        </tr>

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Employer Identification Number (EIN)</th>
                                          <td className="text-muted">{user.einnumber}</td>
                                        </tr>

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Employer Type</th>
                                          <td className="text-muted">{user.employer_type}</td>
                                        </tr>

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Number of Employees</th>
                                          <td className="text-muted">{user.number_of_employees}</td>
                                        </tr>

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>How Did You Hear About Us?</th>
                                          <td className="text-muted">{user.hear_about}</td>
                                        </tr>

                                       {user.hear_about === 'Other' && <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>{user.hear_about}</th>
                                          <td className="text-muted">{user.hear_about_other}</td>
                                        </tr>}

                                        <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Job Count</th>
                                          <td className="text-muted">{user.job_count}</td>
                                        </tr>

                                        {user?.business_document && user?.business_document?.length > 0 && <tr>
                                          <th className="ps-0" scope="row" style={{width:'25%'}}>Documents</th>
                                          <td className="text-muted">
                                            {user.business_document.map((file, index) => (
                                              (file && file != "undefined" && <div className='upload_file_name d-flex' key={'name_'+index}>
                                                    <div className='ufn_left' >
                                                        <span>{file}</span>
                                                    </div> &nbsp;&nbsp;&nbsp;

                                                    <FileDownloadLink file={file}  key={'file_'+index} />
                                                </div>)
                                            ))}
                                          </td>
                                        </tr>}

                                      </>
                                  )}

                                  {
                                    (user.user_type==="teenager" || user.user_type==="parents") &&
                                    <tr>
                                      <th className="ps-0" scope="row" style={{width:'25%'}}>Total Credits</th>
                                      <td className="text-muted fw-semibold">{user.user_credit}</td>
                                    </tr>
                                  }
                                </tbody>
                              </Table>
                            </div>


                          </CardBody>
                        </Card>
                      </Col>

                      {txn.length > 0 && <Col xxl={12}>
                        <Card>
                          <CardBody>
                            <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> Transactions </h1>
                            <div className='' style={{padding: '10px 0px', borderTop: '1px dotted rgb(135, 138, 153)',maxHeight: '300px', overflow: 'auto'}}>
                              <table className="table">
                                  <thead>
                                    <tr>
                                      <th scope="col">#</th>
                                      <th scope="col">Type</th>
                                      <th scope="col">Description</th>
                                      <th scope="col">Credit</th>
                                      <th scope="col">Date/Time</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      txn.map((value, index) => (
                                        <tr key={value._id}>
                                          <th scope="row">{index+1}</th>
                                          <td><span className="fw-semibold" style={{color:`${value.type =='debit'?'red':'green'}`}}>{value.type.toUpperCase()}</span></td>
                                          <td>{value.description}</td>
                                          <td>{value.credit?.toLocaleString('en')}</td>
                                          <td>{
                                            new Date(value.createdAt).toLocaleDateString('en-US', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                              hour: 'numeric',
                                              minute: 'numeric',
                                              second: 'numeric' // optional
                                            })
                                          }</td>
                                        </tr>
                                      ))
                                    }
                                  </tbody>
                                </table>
                              </div>
                          </CardBody>
                        </Card>
                      </Col>}

                      { resume &&
                        <Col xxl={12}>

                          {/* Personal Information
                          <Card>
                            <CardBody>
                              <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> Personal Information </h1>
                              <div className='' style={{padding: '10px 0px', borderTop: '1px dotted rgb(135, 138, 153)'}}>
                                <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', border: '0' }}>
                                  <tr>
                                    <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Name</td>
                                    <td className="text-muted">{resume.user_info.name}</td>
                                  </tr>
                                  <tr>
                                    <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Phone Number</td>
                                    <td className="text-muted">{resume.user_info.phone_number}</td>
                                  </tr>
                                  <tr>
                                    <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Email</td>
                                    <td className="text-muted">{resume.user_info.email}</td>
                                  </tr>
                                  <tr>
                                    <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Location</td>
                                    <td className="text-muted">{resume.user_info.location}</td>
                                  </tr>
                                  <tr>
                                    <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Pronouns</td>
                                    <td className="text-muted">{resume.user_info.pronouns}</td>
                                  </tr>
                                </table>
                              </div>
                            </CardBody>
                          </Card> */}

                          {/* Objective Summary */}
                          {resume.objective_summary &&
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> Objective Summary </h1>
                                <div className='' style={{padding: '10px 0px', borderTop: '1px dotted rgb(135, 138, 153)'}}>
                                  <p className="text-muted mb-0">{resume.objective_summary} </p>
                                </div>
                              </CardBody>
                            </Card>
                          }

                          {/* References */}
                          {resume.references.length > 0 && (
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> References </h1>
                                  {resume.references.length > 0 && resume.references.map((reference, index) => (
                                    <div className='pb-2' style={{borderTop: '1px dotted #878a99', padding: '10px 0px'}} key={index}>
                                      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', border: '0' }}>
                                        <tr>
                                          <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Name</td>
                                          <td className="text-muted">{reference.first_name} {reference.last_name}</td>
                                        </tr>
                                        <tr>
                                          <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Relationship</td>
                                          <td className="text-muted">{reference.relation||'-'}</td>
                                        </tr>
                                        <tr>
                                          <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Organization</td>
                                          <td className="text-muted">{reference.organization}</td>
                                        </tr>
                                        <tr>
                                          <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Phone Number</td>
                                          <td className="text-muted">{reference.phone_number}</td>
                                        </tr>
                                        <tr>
                                          <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Email</td>
                                          <td className="text-muted">{reference.email}</td>
                                        </tr>
                                      </table>
                                    </div>
                                  ))}

                              </CardBody>
                            </Card>
                          )}

                          {/* Skills */}
                          {resume.skills.length > 0 && (
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0',  paddingBottom: '10px', borderBottom: '1px dotted rgb(135, 138, 153)' }}> Skills </h1>
                                  <ul style={{listStyle: 'none', margin: '0', padding: '0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {resume.skills.length > 0 && resume.skills.map((skill, index) => (
                                      <li style={{ padding: '5px 10px', borderRadius: '25px', background: 'rgb(199, 205, 236)', fontSize: '12px', marginRight: '5px', marginBottom: '5px' }} key={index}>{skill.name}</li>
                                    ))}
                                  </ul>
                              </CardBody>
                            </Card>
                          )}

                          {/* Education */}
                          {resume.education.length > 0 && (
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> Education </h1>
                                  {resume.education.length > 0 && resume.education.map((edu, index) => (
                                    <React.Fragment key={index}>
                                      <div className='' style={{padding: '10px 0px', borderTop: '1px dotted rgb(135, 138, 153)'}}>
                                        <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', border: '0' }}>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>School Name</td>
                                            <td className="text-muted">{edu.school_name}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>College Degree</td>
                                            <td className="text-muted">{edu.college_degree}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Study Field</td>
                                            <td className="text-muted">{edu.study_field}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Graduation Start Year</td>
                                            <td className="text-muted">{window.formatDate2(edu.graduation_start_year)}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Graduation End Year</td>
                                            <td className="text-muted">{window.formatDate2(edu.graduation_end_year)}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>GPA</td>
                                            <td className="text-muted">{edu.gpa}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600', verticalAlign: 'top'}}>Education Description</td>
                                            <td className="text-muted">{edu.education_description}</td>
                                          </tr>
                                        </table>
                                      </div>
                                    </React.Fragment>
                                  ))}
                              </CardBody>
                            </Card>
                          )}

                          {/* Hobbies */}
                          {resume.hobbies.length > 0 && (
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0',  paddingBottom: '10px', borderBottom: '1px dotted rgb(135, 138, 153)' }}> Hobbies </h1>
                                <ul style={{listStyle: 'none', margin: '0', padding: '0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                  {resume.hobbies.length > 0 && resume.hobbies.map((hobby, index) => (
                                  <li style={{ padding: '5px 10px', borderRadius: '25px', background: 'rgb(199, 205, 236)', fontSize: '12px', marginRight: '5px', marginBottom: '5px' }} key={index}>{hobby.name}</li>
                                  ))}
                                </ul>
                              </CardBody>
                            </Card>
                          )}

                          {/* Certifications */}
                          {resume.certification.length > 0 && (
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> Certifications </h1>
                                  {resume.certification.length > 0 && resume.certification.map((cert, index) => (
                                    <React.Fragment key={index}>
                                      <div className='' style={{padding: '10px 0px', borderTop: '1px dotted rgb(135, 138, 153)'}}>
                                        <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', border: '0' }}>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Certification Name</td>
                                            <td className="text-muted">{cert.certification_name}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Organization/issuer</td>
                                            <td className="text-muted">{cert.institution}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Issue Date</td>
                                            <td className="text-muted">{window.formatDate2(cert.issue_date)}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Expiry Date</td>
                                            <td className="text-muted">{cert.expiry_date?window.formatDate2(cert.expiry_date):'-'}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Category or Field</td>
                                            <td className="text-muted">{cert.category_of_field}</td>
                                          </tr>

                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Credential ID</td>
                                            <td className="text-muted">{cert.credential_id||'-'}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Credential URL</td>
                                            <td className="text-muted">{cert.credential_url||'-'}</td>
                                          </tr>
                                        </table>
                                      </div>
                                    </React.Fragment>
                                  ))}

                              </CardBody>
                            </Card>
                          )}

                          {/* Awards and Achievements */}
                          {resume.awards_achievments.length > 0 && (
                            <Card>
                              <CardBody>
                                  <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> Awards and Achievements </h1>
                                  {resume.awards_achievments.length > 0 && resume.awards_achievments.map((award, index) => (
                                    <React.Fragment key={index}>
                                      <div className='' style={{padding: '10px 0px', borderTop: '1px dotted rgb(135, 138, 153)'}}>
                                        <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', border: '0' }}>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Certification Name</td>
                                            <td className="text-muted">{award.certification_name}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Awarding Organization</td>
                                            <td className="text-muted">{award.awarding_organization}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Date Received</td>
                                            <td className="text-muted">{award.date_received?window.formatDate2(award.date_received):'-'}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600', verticalAlign: 'top'}}>Brief Description</td>
                                            <td className="text-muted">{award.brief_description}</td>
                                          </tr>
                                        </table>
                                      </div>
                                    </React.Fragment>
                                  ))}
                              </CardBody>
                            </Card>
                          )}

                          {/* Volunteer Experience */}
                          {resume.volunteer_experience.length > 0 && (
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> Volunteer Experience </h1>

                                  {resume.volunteer_experience.length > 0 && resume.volunteer_experience.map((vol, index) => (
                                    <React.Fragment key={index}>
                                      <div className='' style={{padding: '10px 0px', borderTop: '1px dotted rgb(135, 138, 153)'}}>
                                        <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', border: '0' }}>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Organization</td>
                                            <td className="text-muted">{vol.organizationname}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Start Date</td>
                                            <td className="text-muted">{window.formatDate2(vol.startdate)}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>End Date</td>
                                            <td className="text-muted">{window.formatDate2(vol.enddate)}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Total Hours</td>
                                            <td className="text-muted">{vol.totalhours}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>First Name</td>
                                            <td className="text-muted">{vol.firstname}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Last Name</td>
                                            <td className="text-muted">{vol.lastname}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Phone Number</td>
                                            <td className="text-muted">{vol.phonenumber}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Email</td>
                                            <td className="text-muted">{vol.email}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Responsibilities</td>
                                            <td className="text-muted">{vol.responsibilities}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600', verticalAlign: 'top'}}>Accomplishments</td>
                                            <td className="text-muted">{vol.accomplishments}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Rewarding Aspect</td>
                                            <td className="text-muted">{vol.rewardingaspect}</td>
                                          </tr>
                                        </table>
                                      </div>
                                    </React.Fragment>
                                  ))}

                              </CardBody>
                            </Card>
                          )}

                          {/* Extracurricular Activities */}
                          {resume.extracurricular_activities.length > 0 && (
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0',  paddingBottom: '10px', borderBottom: '1px dotted rgb(135, 138, 153)' }}> Extracurricular Activities </h1>
                                <ul style={{listStyle: 'none', margin: '0', padding: '0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                  {resume.extracurricular_activities.length > 0 && resume.extracurricular_activities.map((activity, index) => (
                                      <li style={{ padding: '5px 10px', borderRadius: '25px', background: 'rgb(199, 205, 236)', fontSize: '12px', marginRight: '5px', marginBottom: '5px' }} key={index}>{activity.name}</li>
                                    ))}
                                </ul>
                              </CardBody>
                            </Card>
                          )}

                          {/* Work Experience */}
                          {resume.work_experience.length > 0 && (
                            <Card>
                              <CardBody>
                                <h1 className='mb-3 card-title' style={{ fontWeight: '600', textAlign: 'left', padding: '0' }}> Work Experience </h1>
                                  {resume.work_experience.length > 0 && resume.work_experience.map((work, index) => (
                                    <React.Fragment key={index}>
                                      <div className='' style={{padding: '10px 0px', borderTop: '1px dotted rgb(135, 138, 153)'}}>
                                        <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', border: '0' }}>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Title</td>
                                            <td className="text-muted">{work.title}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Company Name</td>
                                            <td className="text-muted">{work.company_name}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Start Date</td>
                                            <td className="text-muted">{window.formatDate2(work.start_date)}</td>
                                          </tr>
                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>End Date</td>
                                            <td className="text-muted">{(work.end_date?window.formatDate2(work.end_date):'')||'Present'}</td>
                                          </tr>

                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Supervisor First Name</td>
                                            <td className="text-muted">{work.first_name}</td>
                                          </tr>

                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Supervisor Last Name</td>
                                            <td className="text-muted">{work.last_name}</td>
                                          </tr>

                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Supervisor Phone Number</td>
                                            <td className="text-muted">{work.phone_number}</td>
                                          </tr>

                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600'}}>Supervisor Email</td>
                                            <td className="text-muted">{work.email}</td>
                                          </tr>

                                          <tr>
                                            <td className="ps-0" style={{width:'25%', fontWeight: '600', verticalAlign: 'top'}}>Description</td>
                                            <td className="text-muted">{work.description}</td>
                                          </tr>

                                        </table>
                                      </div>
                                    </React.Fragment>
                                  ))}
                              </CardBody>
                            </Card>
                          )}
                        </Col>
                      }

                    </Row>
                  </TabPane>
                </TabContent>

              </div>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );

};

export default ViewUser;