import React from 'react';
import { Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TripDetailsDA } from '../data-access/TripDetailsDA';

export class TripSettingsPage extends React.Component {
  constructor(props) {
    super(props);

    const { tripId = null } = props;

    this.state = {
      tripId,
      redirect: false,
    };
  }

  handleRedirect(path) {
    this.setState({ redirect: path });
  }

  render() {
    const { redirect, tripId } = this.state;
    return (
      <div>
        <Container>
          {redirect
            ? (
              <Redirect
                push
                to={{
                  pathname: redirect,
                  state: { refresh: true, messageObj: { text: 'Saved', variant: 'success' } },
                }}
              />
            )
            : (
              <Row>
                <Col>
                  <TripDetailsDA
                    tripId={tripId}
                    redirect={(path) => this.handleRedirect(path)}
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
