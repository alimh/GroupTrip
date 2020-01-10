import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect } from 'react-router-dom';

import { TripDetailsDA } from '../data-access/TripDetailsDA';

export class NewTripPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyNewTrip: Math.random(),
      redirect: null,
      canceled: null
    };
  }

  handleRedirect(path) {
    this.setState({ redirect: path });
  }
  handleCancel() {
    // console.log('canceling');
    // BrowserHistory.goBack();
  }
  render() {
    return (
      <div>
        <br />
        <Container>
          <h3>New Trip Details</h3>
          {this.state.redirect ? (
            <Redirect
              push
              to={{
                pathname: this.state.redirect,
                state: {
                  messageObj: { text: 'Trip Created', variant: 'success' }
                }
              }}
            />
          ) : (
            <Row className="justify-content-md-center">
              <Col>
                <TripDetailsDA
                  key={this.state.keyNewTrip}
                  redirect={path => this.handleRedirect(path)}
                  cancel={() => this.handleCancel()}
                />
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default NewTripPage;
