import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, CardHeader,  Col, Container, Row, Input, Label, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import TableContainer from "../../Components/Common/TableContainerReactTable";

import { Link, useParams } from "react-router-dom";

import SweetAlert from 'react-bootstrap-sweetalert';

import { APIClient } from "../../helpers/api_helper";

import $ from "jquery";

const api = new APIClient();

const List = () => {


  const { key:For } = useParams();

  document.title = "Plans | "+process.env.REACT_APP_SITE_NAME;

  const [defaultTable, setDefaultTable] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [delId, setDelId] = useState('');
  const [planfor, setPlanFor] = useState('');


  useEffect(() => {
    setPlanFor(For)
    fetchData();
    // eslint-disable-next-line
  }, [For]);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/plan/get?plan_for=${For}`);
      setDefaultTable(response.data)
      setPlanFor(For)
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
    const response = await api.delete(`${process.env.REACT_APP_API_URL}/plan/delete/${delId}`);

    if(response.status) {
      window.notify('success',response.message);
      setShowAlert(false);
      fetchData();
    }
  };

  const handleSwitch = async (e) => {
    let input = e.target;
    const response = await api.update(`${process.env.REACT_APP_API_URL}/plan/update/${input.getAttribute('data-id')}`, {
      status: input.checked,
      id : input.getAttribute('data-id')
    });

    if(response.status) {
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
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Title",
        accessor: "title",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Plan For",
        accessor: "for",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Credit/Price",
        accessor: (cellProps) => { return ( (cellProps.for==='Student'?"":"$")+cellProps.price ) },
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
              <Link to={"/plan/manage/"+cellProps.id} className="link-success fs-15"><i className="ri-edit-line"></i></Link>
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

          <BreadCrumb title="Plans" pageTitle="Plans" />

          <Row>
            <Col xs={12}>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Plans</h5>
                </CardHeader>
                <CardBody>

                 {/*  <Link to={"/plan/manage"}>
                    <Button className="btn-border" outline><i className="ri-add-line"></i> Add Plan</Button>
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

export default List;