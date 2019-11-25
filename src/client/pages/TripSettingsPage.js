import React from 'react';
import { Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TripDetailsDA } from '../data-access/TripDetailsDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class TripSettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: props.tripId || null,
      messageObj: null,
      redirect: null,
    };
  }

  handleMessage(m) {
    this.setState({ messageObj: m });
    if (m.variant === 'success') setTimeout(() => this.handleRedirect(), 1000);
  }

  handleRedirect() {
    this.setState({ redirect: true });
  }
  handleGetRedirectPath(path) {
    this.setState({ redirectPath: path });
  }
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <DisappearingAlert
                messageObj={this.state.messageObj}
                disappear={false}
              />
            </Col>
          </Row>
          {this.state.redirect ? (
            <Redirect push to={this.state.redirectPath} />
          ) : (
            <TripDetailsDA
              tripId={this.state.tripId}
              message={m => this.handleMessage(m)}
              redirectPath={path => this.handleGetRedirectPath(path)}
              onCancel={() => this.handleRedirect()}
            />
          )}
        </Container>
      </div>
    );
  }
}

export default TripSettingsPage;
