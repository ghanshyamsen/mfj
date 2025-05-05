import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, CardHeader,  Col, Container, Row, Input, Label, Button, UncontrolledAlert } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from "../../../Components/Common/TableContainerReactTable";

import { Link } from "react-router-dom";

import SweetAlert from 'react-bootstrap-sweetalert';

import { APIClient } from "../../../helpers/api_helper";

import $ from "jquery";

const api = new APIClient();

const List = () => {

  document.title = "Skills Learning Materials | "+process.env.REACT_APP_SITE_NAME;

  const [defaultTable, setDefaultTable] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [delId, setDelId] = useState('');
  const Url = new URL(window.location.href).searchParams;
  const skillparm = Url.get('skill');
  const [ skill, setSkill ] = useState(skillparm?skillparm:'');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/lms/material/get${skill?'?skill='+skill:''}`);
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
    const response = await api.delete(`${process.env.REACT_APP_API_URL}/lms/material/delete/${delId}`);

    if(response.status) {
      window.notify('success',response.message);
      setShowAlert(false);
      fetchData();
    }
  };

  const handleSwitch = async (e) => {
    let input = e.target;
    const response = await api.update(`${process.env.REACT_APP_API_URL}/lms/material/update/${input.getAttribute('data-id')}`, {
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

  const reorder = async (Id, order, dir) => {

    try {

      const response = await api.update(`${process.env.REACT_APP_API_URL}/lms/material/update/${Id}`, {
        order,
        dir,
        atype : "order"
      });

      if(response.status) {
        fetchData();
      }

    } catch (error) {
      console.log(error.message)
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
        //disableSortBy: false
      },
      {
        Header: "Title",
        accessor: "title",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Skill",
        accessor: "skill",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Order",
        accessor: "order",
        disableFilters: true,
        filterable: false,
      },
      /* {
        Header: "Status",
         accessor: (cellProps) => {
          return (
            <div className="form-check form-switch">
              <Input className="form-check-input" type="checkbox" role="switch" data-id={cellProps.id} onChange={handleSwitch} id={"SwitchCheck"+cellProps.id} defaultChecked={(cellProps.status)?true:false}  />
              &nbsp; { (cellProps.status)?<span className="ms-2 badge badge-soft-success">Active</span>:<span className="badge badge-soft-danger">Disabled</span> }
            </div>
          )
        },
        disableFilters: true,
        filterable: false,
      }, */
      {
        Header: "Last Updated",
        accessor: "updated",
        disableFilters: true,
        filterable: false,
      },
      /* {
        Header: "Action",
        accessor: (cellProps) => {
          console.log(cellProps.order);
          const isNotLast = cellProps.s_no !== defaultTable.length;
          const isNotFirst = cellProps.s_no > 1;
          const isDeletable = cellProps.pcount <= 0;

          return (
            <div className="hstack gap-3 flex-wrap">
              <Link
                to={`/lms/learning-material/manage/${cellProps.id}`}
                className="link-success fs-15"
                title="Edit"
              >
                <i className="ri-edit-line"></i>
              </Link>

              {isNotLast && (
                <Button
                  color="success"
                  className="btn-icon rounded fs-5 bg-soft-success"
                  outline
                  data-id={cellProps.id}
                  title="Move Up"
                >
                  <i className="text-success ri-arrow-up-line"></i>
                </Button>
              )}

              {isNotFirst && (
                <Button
                  color="primary"
                  className="btn-icon rounded fs-5 bg-soft-secondary"
                  outline
                  data-id={cellProps.id}
                  title="Move Down"
                >
                  <i className="text-secondary ri-arrow-down-line"></i>
                </Button>
              )}

              {isDeletable && (
                <Button
                  color="danger"
                  className="btn-icon btn-border"
                  outline
                  data-id={cellProps.id}
                  onClick={handleShowAlert}
                  title="Delete"
                >
                  <i className="ri-delete-bin-line"></i>
                </Button>
              )}
            </div>
          );
        },
        disableFilters: true,
        filterable: false,
        disableSortBy: true
      } */
      {
        Header: "Action",
        accessor: (cellProps) => cellProps,
        Cell: ({ row, value, rows }) => {
          const currentOrder = value.order;
          const maxOrder = Math.max(...rows.map(r => r.original.order)); // get highest order in current list
          const sortBy = row.getToggleRowExpandedProps?.()?.sortBy || []; // fallback if no sorting
          const firstOrder = rows?.[0].original?.order;
          const sortField = sortBy[0]?.id;
          const sortDirection = (firstOrder === maxOrder) ? 'desc' : 'asc';

          let showUp = true;
          let showDown = true;
          if (sortDirection === 'asc') {

            if (currentOrder === 1) showUp = false;
            if (currentOrder === maxOrder) showDown = false;
          } else {
            if (currentOrder === 1) showDown = false;
            if (currentOrder === maxOrder) showUp = false;
          }


          return (
            <div className="hstack gap-3 flex-wrap">
              <Link
                to={`/lms/learning-material/manage/${value.id}`}
                className="link-success fs-15"
                title="Edit"
              >
                <i className="ri-edit-line"></i>
              </Link>

              {skill && showUp && (
                <Button
                  color="success"
                  className="btn-icon rounded fs-5 bg-soft-success"
                  outline
                  data-id={value.id}
                  title="Move Up"
                  onClick={() => { reorder(value.id,value.order,(sortDirection === 'asc'?'up':'down'))}}
                >
                 <i className="text-success ri-arrow-up-line"></i>
                </Button>
              )}

              {skill && showDown && (
                <Button
                  color="primary"
                  className="btn-icon rounded fs-5 bg-soft-secondary"
                  outline
                  data-id={value.id}
                  title="Move Down"
                  onClick={() => { reorder(value.id,value.order,(sortDirection === 'asc'?'down':'up'))}}
                >
                  <i className="text-secondary ri-arrow-down-line"></i>
                </Button>
              )}

              {value.pcount <= 0 && (
                <Button
                  color="danger"
                  className="btn-icon btn-border"
                  outline
                  data-id={value.id}
                  onClick={handleShowAlert}
                  title="Delete"
                >
                  <i className="ri-delete-bin-line"></i>
                </Button>
              )}
            </div>
          );
        },
        disableFilters: true,
        disableSortBy: true
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

          <BreadCrumb title="Skills Learning Materials" pageTitle="Skills Learning Materials" />

          <Row>
            <Col xs={12}>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Skills Learning Materials</h5>
                </CardHeader>
                <CardBody>

                  <Link to={`/lms/learning-material/manage${skill?'?skill='+skill:''}`}>
                    <Button className="btn-border" outline><i className="ri-add-line"></i> Add Learning Material</Button>
                  </Link>

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