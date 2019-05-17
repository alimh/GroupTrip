import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { AllTripsDA } from '../data-access/AllTripsDA';

export class AllTrips extends React.Component {
  constructor() {
    super();

    this.state = {
      keys: {
        trips: Math.random(),
      },
      messages: {
        success: null,
        error: null,
      },
    };
  }

  handleMessage(k, m) {
    // display message
    this.setState({ messages: { ...m } });
  }

  render() {
    return (
      <div className="home">
        <Jumbotron>
          <Container>
            <Row className="justify-content-md-center">
              <h2 className="display-3">Share Costs Between Friends</h2>
            </Row>
            <Row className="justify-content-md-center">
              <h2 className="display-4">Stay Friends!</h2>
            </Row>
          </Container>
        </Jumbotron>
        <Container>
          <h3>Get Started</h3>
          <h3>
            <small className="text-muted">Select a Trip</small>
          </h3>
          <DisappearingAlert
            msg={this.state.messages.error}
            variant="danger"
            disapper={false}
          />
          <DisappearingAlert
            msg={this.state.messages.success}
            variant="success"
          />

          <Row className="justify-content-md-center">
            <Col>
              <ListGroup>
                <LinkContainer to="/new">
                  <ListGroup.Item action variant="primary">
                    Add a new trip
                  </ListGroup.Item>
                </LinkContainer>
              </ListGroup>
              <br />
              <AllTripsDA
                key={this.state.keys.trips}
                message={m => this.handleMessage(this.state.keys.trips, m)}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default AllTrips;
