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

const Skills = () => {

  document.title ="Skills Assessment | "+process.env.REACT_APP_SITE_NAME;

  const [ defaultTable, setDefaultTable ] = useState([]);
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
      const response = await api.get(`${process.env.REACT_APP_API_URL}/skills-assessment/get`);
      setDefaultTable(response.data)
    } catch (error) {
      console.error(error);
    }
  };

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
        Header: "Question",
        accessor: "question",
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
              <Link to={"/skills/manage-assessment/"+cellProps.id} className="link-success fs-15"><i className="ri-edit-line"></i></Link>
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
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Skills Assessment List" pageTitle="Skills Assessment" />
          <Row>
            <Col xs={12}>
              {errorMsg ? (<UncontrolledAlert color="danger" className="alert-top-border mb-xl-0"> <i className="ri-error-warning-line me-3 align-middle fs-16 text-danger "></i><strong>Danger</strong> - {errorMsg} </UncontrolledAlert>) : null}
              {successMsg  ? (<UncontrolledAlert color="success" className="alert-top-border"> <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i><strong>Success</strong> - {successMsg} </UncontrolledAlert>) : null}

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Skills Assessment</h5>
                </CardHeader>
                <CardBody>

                  {/* <Link to={"/skills/manage-assessment"}>
                    <Button className="btn-border" outline><i className="ri-add-line"></i> Add Assessment</Button>
                  </Link> */}

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

export default Skills;