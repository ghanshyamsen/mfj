import React from 'react';
import { Container, Card, CardBody, Row, Col } from 'reactstrap';
import Widget from "./Widgets";

import { APIClient, setAuthorization, getLoggedinUser } from "../../helpers/api_helper";

const DashboardCrm = () => {

    document.title="Dashboard | My First Job";

    const User = getLoggedinUser();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Card>
                        <CardBody>
                            <div className="text-center">
                                <h1>Welcome, {User?.data?.name}</h1>
                            </div>
                        </CardBody>
                    </Card>
                    <Row>
                        <Widget />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardCrm;