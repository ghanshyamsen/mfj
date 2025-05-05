import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
  UncontrolledAlert,
} from "reactstrap";
import { Link } from "react-router-dom";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { APIClient } from "../../helpers/api_helper";
import SweetAlert from "react-bootstrap-sweetalert";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const api = new APIClient();

function MessagesList() {
  const [defaultTable, setDefaultTable] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [delId, setDelId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/message/template/get`
      );
      setDefaultTable(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowAlert = (event) => {
    const input = event.currentTarget;
    const deleteId = input.getAttribute("data-id");
    setDelId(deleteId);
    setShowAlert(true);
  };

  const handleConfirm = async () => {
    const response = await api.delete(
      `${process.env.REACT_APP_API_URL}/message/template/delete/${delId}`
    );
    if (response.status) {
      window.notify("success", response.message);
      setTimeout(() => setSuccessMsg(""), 5000);
      setShowAlert(false);
      setDelId("");
      fetchData();
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (cellProps) => {
          return <span className="fw-semibold">{cellProps.s_no}</span>;
        },
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Message",
        accessor: "message",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Type",
        accessor: "type",
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
              <Link
                to={"/messages/manage/" + cellProps.id}
                className="link-success fs-15"
              >
                <i className="ri-edit-line"></i>
              </Link>
              <Button
                color="danger"
                className="btn-icon btn-border"
                outline
                data-id={cellProps.id}
                onClick={handleShowAlert}
              >
                <i className="ri-delete-bin-line"></i>
              </Button>
            </div>
          );
        },
        disableFilters: true,
        filterable: false,
        disableSortBy: true,
      },
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
        You will not be able to recover this message!
      </SweetAlert>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Message List" pageTitle="Message Template" />
          <Row>
            <Col xs={12}>
              {successMsg ? (
                <UncontrolledAlert color="success" className="alert-top-border">
                  {" "}
                  <i className="ri-notification-off-line me-3 align-middle fs-16 text-success"></i>
                  <strong>Success</strong> - {successMsg}{" "}
                </UncontrolledAlert>
              ) : null}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Message</h5>
                </CardHeader>
                <CardBody>
                  <Link to={"/messages/manage"}>
                    <Button className="btn-border" outline>
                      <i className="ri-add-line"></i> Add Message
                    </Button>
                  </Link>
                  <TableContainer
                    columns={columns || []}
                    data={defaultTable || []}
                    isPagination={true}
                    isGlobalFilter={true}
                    iscustomPageSize={true}
                    isBordered={true}
                    customPageSize={10}
                    className="custom-header-css table align-middle table-nowrap"
                    tableClassName="table-centered align-middle table-nowrap mb-0"
                    theadClassName="text-muted table-light"
                    SearchPlaceholder="Search..."
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default MessagesList;
