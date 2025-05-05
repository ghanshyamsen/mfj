import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, CardHeader,  Col, Container, Row, Input, Label, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import TableContainer from "../../Components/Common/TableContainerReactTable";

import { Link } from "react-router-dom";

import { APIClient } from "../../helpers/api_helper";

import $ from "jquery";

const api = new APIClient();

const List = () => {

  document.title = "Skills and Learning Path Purchase Transaction | "+process.env.REACT_APP_SITE_NAME;

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
      const response = await api.get(`${process.env.REACT_APP_API_URL}/transaction/module`);
      setDefaultTable(response.data)
    } catch (error) {
      console.error(error.message);
    }
  };

  const columns = useMemo(
    () => [

      {
        Header: "Type",
        accessor: (cellProps) => {
          return ( cellProps.type.toUpperCase() )
        },
        disableFilters: false,
        filterable: false,
      },
      {
        Header: "User",
        accessor: (cellProps) => {
          return (
            <Link to={"/view-user/"+cellProps.user._id}>
              <span className="fw-semibold">{cellProps.user.first_name} {cellProps.user.last_name}</span>
            </Link>
          )
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Description",
        accessor: 'txn.description',
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Credit",
        accessor: (cellProps) => { return ( cellProps.credit?cellProps.credit.toLocaleString('en'):'N/A')},
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Date",
        accessor: "createdAt",
        accessor: (cellProps) => { return (
          new Date(cellProps.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric' // optional
          })
        )},
        disableFilters: true,
        filterable: false,
      }
    ],
    []
  );


  return (
    <React.Fragment>

      <div className="page-content">
        <Container fluid>

          {/* <BreadCrumb title="Skills and Learning Path Purchase Transaction" pageTitle="Skills and Learning Path Purchase Transaction " /> */}

          <Row>
            <Col xs={12}>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Skills and Learning Path Purchase Transaction</h5>
                </CardHeader>
                <CardBody>
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

export default List;