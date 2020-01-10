import React from 'react';
import { Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TripDetailsDA } from '../data-access/TripDetailsDA';

export class TripSettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: props.tripId || null,
      redirect: false
    };
  }

  handleRedirect(path) {
    this.setState({ redirect: path });
  }
  render() {
    return (
      <div>
        <Container>
          {this.state.redirect ? (
            <Redirect
              push
              to={{
                pathname: this.state.redirect,
                state: { messageObj: { text: 'Saved', variant: 'success' } }
              }}
            />
          ) : (
            <Row>
              <Col>
                <TripDetailsDA
                  tripId={this.state.tripId}
                  redirect={path => this.handleRedirect(path)}
                  onCancel={() => this.handleRedirect()}
                />
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default TripSettingsPage;
