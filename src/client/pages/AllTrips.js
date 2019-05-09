import React from 'react';
import { Link } from 'react-router-dom';
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
        <Container>
          <h3>Trips</h3>
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
                <ListGroup.Item variant="primary">
                  <Link to="/new">Add a new trip</Link>
                </ListGroup.Item>
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
