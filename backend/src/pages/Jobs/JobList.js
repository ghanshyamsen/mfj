import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, CardHeader,  Col, Container, Row, Input, Label, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import TableContainer from "../../Components/Common/TableContainerReactTable";

import { Link } from "react-router-dom";

import SweetAlert from 'react-bootstrap-sweetalert';

import $ from "jquery";

//redux
import { useSelector, useDispatch } from "react-redux";

import { APIClient } from "../../helpers/api_helper";
const api = new APIClient();

const Job = () => {

  document.title ="Jobs | "+process.env.REACT_APP_SITE_NAME;

  const [defaultTable, setDefaultTable] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [delId, setDelId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/job/get`);
      setDefaultTable(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowAlert = async (e) => {
    let input = e.currentTarget;
    let deleteId = input.getAttribute('data-id');
    setDelId(deleteId);
    setShowAlert(true);
  };

  const handleConfirm = async () => {
    //Code to execute when the user clicks the "Confirm" button
    const response = await api.delete(`${process.env.REACT_APP_API_URL}/job/delete/${delId}`);

    if(response.status) {
      window.notify('success',response.message);
      setTimeout(() => setSuccessMsg(''),5000);
      setShowAlert(false);
      fetchData();
    }
  };

  const handleSwitch = async (e) => {
    let input = e.target;
    const response = await api.update(`${process.env.REACT_APP_API_URL}/job/update-status`, {
      status: input.checked,
      id : input.getAttribute('data-id')
    });

    if(response.status === "success") {
      if(input.checked){
        //code
        $(input).next('span').remove();
        $(input).parent('div').append(`<span class="ms-2 badge badge-soft-success">Active</span>`);
      }else{
        //code
        $(input).next('span').remove();
        $(input).parent('div').append(`<span class="ms-2 badge badge-soft-danger">Disabled</span>`);
      }
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (cellProps) => {
          return (
            <span className="fw-semibold">{cellProps.s_no}</span>
          )
        },
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Job Position",
        accessor: "job_position",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Location",
        accessor: "location",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Job Payscale",
        accessor: "job_payscale",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Status",
         accessor: (cellProps) => {
          return (
            <div className="form-check form-switch">
              <Input className="form-check-input" type="checkbox" role="switch" data-id={cellProps.id} onChange={handleSwitch} id={"SwitchCheck"+cellProps.id} defaultChecked={(cellProps.job_status)?true:false}  />
              &nbsp; { (cellProps.job_status)?<span className="ms-2 badge badge-soft-success">Active</span>:<span className="badge badge-soft-danger">Disabled</span> }
            </div>
          )
        },
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Added By",
         accessor: (cellProps) => {
          return (
            <Link to={"/view-user/"+cellProps.user_id} className="link-success fs-15">{cellProps.user_name}</Link>
          )
        },
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Last Updated",
        accessor: "updated",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Action",
        accessor: (cellProps) => {
          return (
            <div className="hstack gap-3 flex-wrap">
              <Link to={"/job/view/"+cellProps.id} className="link-success fs-15"><i className="ri-eye-line"></i></Link>
              <Button color="danger" className="btn-icon btn-border" outline data-id={cellProps.id} onClick={handleShowAlert}><i className="ri-delete-bin-line"></i></Button>
            </div>
          )
        },
        disableFilters: true,
        filterable: false,
        disableSortBy:true
      }
    ],
    []
  );

  return (
    <React.Fragment>
       <SweetAlert
        show={showAlert}
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={handleConfirm}
        onCancel={() => setShowAlert(false)}
        focusCancelBtn
      >
        You will not be able to recover this record!
      </SweetAlert>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Jobs" pageTitle="Jobs" />
          <Row>
            <Col xs={12}>
              {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
              {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Jobs</h5>
                </CardHeader>
                <CardBody>

                  {/*<Link to={"/job/manage"}>
                    <Button className="btn-border" outline><i className="ri-add-line"></i> Add Job</Button>
                  </Link>*/}

                  <TableContainer
                    columns={(columns || [])}
                    data={(defaultTable || [])}
                    isPagination={true}
                    isGlobalFilter={true}
                    iscustomPageSize={true}
                    isBordered={true}
                    customPageSize={10}
                    className="custom-header-css table align-middle table-nowrap"
                    tableClassName="table-centered align-middle table-nowrap mb-0"
                    theadClassName="text-muted table-light"
                    SearchPlaceholder='Search...'
                  />

                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );

};

export default Job;