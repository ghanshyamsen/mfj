import React from "react";
import Views from '../../../assets/images/search-file.png';
import Received from '../../../assets/images/application.png';
import ConversionRate from '../../../assets/images/good-conversion-rate.png';
import DropRate from '../../../assets/images/interest-rate.png';
import Clock from '../../../assets/images/clock.png';
import Rating from '../../../assets/images/rating.png';

import { Tooltip } from 'primereact/tooltip';
import { Skeleton } from 'primereact/skeleton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Analytics({analytics, job, loadingSkeleton}){
    return(
        <>
            <div className="recent_block">
            {loadingSkeleton ? <Skeleton width="250px" height='24px' className="mb-3"/> : <h1 className="rtitle text-start">Analytics</h1> }

            <div className='analy_elements_parent_section'>
              <Tooltip target=".analy_elements" />

              <div className="w-100">
                <Row>
                  <Col xl={3} md={6}>
                  {loadingSkeleton ?
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements'>
                        <div className='analy_elements_inner'>
                          <div className='ae_content w-100'>
                            <Skeleton width="60%" height='24px' className="mb-1"/>
                            <Skeleton width="80%" height='30px' />
                          </div>
                          <div className='ae_icon'> <Skeleton width="40px" height='40px' /> </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements'  data-pr-position="top" data-pr-tooltip={job?'Tracks how many potential applicants are viewing job posting.':'Tracks how many potential applicants are viewing each job posting.'}>

                        <div className='analy_elements_inner'>
                          <div className='ae_content w-100'>
                            <h3 className='ae_h3'> Number of Job Views </h3> 
                            <p className='ae_p'> {!job?'Avg.':''} {analytics?.avg_view_counts||0} </p> 
                          </div>
                          <div className='ae_icon'> <img src={Views} alt="" /> </div>
                        </div>
                      </div>
                    </div>
                    }
                  </Col>

                  <Col xl={3} md={6}>
                  {loadingSkeleton ?
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements'>
                        <div className='analy_elements_inner'>
                          <div className='ae_content w-100'>
                            <Skeleton width="60%" height='24px' className="mb-1"/>
                            <Skeleton width="80%" height='30px' />
                          </div>
                          <div className='ae_icon'> <Skeleton width="40px" height='40px' /> </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements' data-pr-position="top" data-pr-tooltip={job?'Measures the total number of applications submitted for job posting.':"Measures the total number of applications submitted for each job posting."} >
                        <div className='analy_elements_inner'>
                          <div className='ae_content w-100'>
                            <h3 className='ae_h3'> Number of Applications Received </h3> 
                            <p className='ae_p'> {!job?'Avg.':''} {analytics?.avg_application_received||0} </p> 
                          </div>
                          <div className='ae_icon'><img src={Received} alt="" />  </div>
                        </div>
                      </div>
                    </div>
                    }
                  </Col>

                  <Col xl={3} md={6}>
                    {loadingSkeleton ?
                      <div className="analy_elements_outer_block">
                        <div className='analy_elements'>
                          <div className='analy_elements_inner'>
                            <div className='ae_content w-100'>
                              <Skeleton width="60%" height='24px' className="mb-1"/>
                              <Skeleton width="80%" height='30px' />
                            </div>
                            <div className='ae_icon'> <Skeleton width="40px" height='40px' /> </div>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="analy_elements_outer_block">
                        <div className='analy_elements' data-pr-position="top" data-pr-tooltip={job?'The average time employers take to respond to applications.':"The average time employers take to respond to applications."} >
                          <div className='analy_elements_inner'>
                            <div className='ae_content'>
                              <h3 className='ae_h3'> Response Time from Employers </h3>
                              <p className='ae_p'> {analytics?.response_time_from_employers?.[0]?.averageTimeReadable||0} </p>
                            </div>
                            <div className='ae_icon'> <img src={Clock} alt="" /> </div>
                          </div>
                        </div>
                      </div>
                    }
                  </Col>

                  <Col xl={3} md={6}>
                  {loadingSkeleton ?
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements'>
                        <div className='analy_elements_inner'>
                          <div className='ae_content w-100'>
                            <Skeleton width="60%" height='24px' className="mb-1"/>
                            <Skeleton width="80%" height='30px' />
                          </div>
                          <div className='ae_icon'> <Skeleton width="40px" height='40px' /> </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements' data-pr-position="top" data-pr-tooltip={job?'The percentage of applications that lead to interviews and hires':"The percentage of applications that lead to interviews and hires"} >
                        <div className='analy_elements_inner'>
                          <div className='ae_content'>
                            <h3 className='ae_h3'> Success Rate of Applications </h3>
                            <p className='ae_p'> {!job?'Avg.':''} {analytics?.success_rate_of_application} </p>
                          </div>
                          <div className='ae_icon'> <img src={Rating} alt="" /> </div>
                        </div>
                      </div>
                    </div>
                    }
                  </Col>
                </Row>
              </div>

              <div className="w-100">
                <Row>

                  <Col md={6}>
                  {loadingSkeleton ?
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements drop-off-rate-outer-div w-full'>
                        <div className='analy_elements_inner'>
                          <div className='ae_content w-100'>
                            <Skeleton width="60%" height='24px' className="mb-1"/>
                            <Skeleton width="80%" height='30px' />
                          </div>
                          <div className='ae_icon'> <Skeleton width="40px" height='40px' /> </div>
                        </div>
                        <div className='drop-off-element'>
                          <ul className="">
                            <li className="d-flex"> <Skeleton width="50%" height='20px' className="inline-block" /> </li>
                            <li className="d-flex"> <Skeleton width="50%" height='20px' className="inline-block" /> </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    :

                    <div className="analy_elements_outer_block">
                      <div className='analy_elements drop-off-rate-outer-div w-full' data-pr-position="top" data-pr-tooltip={job?'Identifies at which stage candidates drop off after initiating the one-button application.':"Identifies at which stage candidates drop off after initiating the one-button application."} >
                        <div className='analy_elements_inner'>
                          <div className='ae_content'>
                            <h3 className='ae_h3'> Application Drop-Off Rate </h3>
                            <p className='ae_p'> {analytics?.dropoff_conversion_rate} </p>
                          </div>
                          <div className='ae_icon'> <img src={DropRate} alt="" /> </div>
                        </div>
                        <div className='drop-off-element'>
                          <ul className="">
                            <li> Drop-Off on Questionnaire : {analytics?.dropoff_on_questionnaire} </li>
                            <li> Drop-Off on Cover Letter : {analytics?.dropoff_on_cover_letter} </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    }
                  </Col>

                  <Col md={6}>
                  {loadingSkeleton ?
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements drop-off-rate-outer-div w-full'>
                        <div className='analy_elements_inner'>
                          <div className='ae_content w-100'>
                            <Skeleton width="60%" height='24px' className="mb-1"/>
                            <Skeleton width="80%" height='30px' />
                          </div>
                          <div className='ae_icon'> <Skeleton width="40px" height='40px' /> </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements conversion_rate_block' data-pr-position="top" data-pr-tooltip={job?'The percentage of clicks on the one-button apply that result in completed applications.':"The percentage of clicks on the one-button apply that result in completed applications."}>
                        <div className='analy_elements_inner'>
                          <div className='ae_content'>
                            <h3 className='ae_h3'> Click-to-Apply Conversion Rate </h3>
                            <p className='ae_p'> {analytics?.apply_conversion_rate} </p>
                          </div>
                          <div className='ae_icon'> <img src={ConversionRate} alt="" /> </div>
                        </div>
                      </div>
                    </div>
                    }
                  </Col>
                </Row>
              </div>

              <div className="w-100">
                <Row>
                  {analytics?.time_to_apply?.length > 0 && <Col lg={6} md={12}>

                  {loadingSkeleton ?
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements time_to_apply_element w-full'>
                        <h3 className='ae_h3'> <Skeleton width="60%" height='24px' className="m-auto mb-3"/> </h3>
                        <div className='tree_block'>
                              {
                                analytics?.time_to_apply.map((value, index) => (
                                  <div className='tree_element' key={value.weekday}>
                                    <p className=''> <Skeleton width="60%" height='18px' className="m-auto"/> </p>
                                    <p className=''> <Skeleton width="60%" height='18px' className="m-auto"/> </p>
                                    <p className=''> <Skeleton width="60%" height='18px' className="m-auto"/> </p>
                                  </div>
                                ))
                              }
                          </div>
                      </div>
                    </div>
                    :
                    <div className="analy_elements_outer_block">
                        <div className='analy_elements time_to_apply_element' data-pr-position="top" data-pr-tooltip={job?'The average time from viewing the job post to clicking the apply button on week days':"The average time from viewing the job post to clicking the apply button on week days"} >
                          <h3 className='ae_h3'> Time to Apply </h3>
                          <div className='tree_block'>
                              {
                                analytics?.time_to_apply.map((value, index) => (
                                  <div className='tree_element' key={value.weekday}>
                                    <p className=''> {value.weekday} </p>
                                    <p className=''> {value.count} </p>
                                    <p className=''>{value.averageTime?.toFixed(1)}m  </p>
                                  </div>
                                ))
                              }
                          </div>
                        </div>
                    </div>
                    }
                  </Col>}

                  {analytics?.peak_days_of_application?.length > 0 &&  <Col lg={6} md={12}>
                  {loadingSkeleton ?
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements time_to_apply_element w-full'>
                        <h3 className='ae_h3'> <Skeleton width="60%" height='24px' className="m-auto mb-3"/> </h3>
                        <div className='tree_block'>
                              {
                                analytics?.time_to_apply.map((value, index) => (
                                  <div className='tree_element' key={value.weekday}>
                                    <p className=''> <Skeleton width="60%" height='18px' className="m-auto"/> </p>
                                    <p className=''> <Skeleton width="60%" height='18px' className="m-auto"/> </p>
                                    <p className=''> <Skeleton width="60%" height='18px' className="m-auto"/> </p>
                                  </div>
                                ))
                              }
                          </div>
                      </div>
                    </div>
                    :
                    <div className="analy_elements_outer_block">
                      <div className='analy_elements time_to_apply_element' data-pr-position="top" data-pr-tooltip={job?'Days of the week when most applications are submitted.':"Days of the week when most applications are submitted."}>
                        <h3 className='ae_h3'> Application Peak Days </h3>
                        <div className='tree_block'>
                            {
                              analytics?.peak_days_of_application.map((value, index) => (
                                <div className='tree_element' key={value.weekday}>
                                  <p className=''> {value.weekday} </p>
                                  <p className=''> {value.count} </p>
                                </div>
                              ))
                            }
                        </div>
                      </div>
                    </div>
                    }
                  </Col>}

                </Row>
              </div>
            </div>

            {/*  */}


          </div>
        </>
    )
}

export default Analytics;