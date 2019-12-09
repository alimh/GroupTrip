import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect } from 'react-router-dom';
import { TripDetailsDA } from '../data-access/TripDetailsDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class NewTripPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyNewTrip: Math.random(),
      messageObj: null,
      redirect: null
    };
  }

  handleMessage(m) {
    // display message
    this.setState({ messageObj: m });
  }

  handleRedirect(path) {
    this.setState({ redirect: path });
  }

  render() {
    return (
      <div>
        <br />
        <Container>
          <h3>New Trip Details</h3>
          <DisappearingAlert messageObj={this.state.messageObj} />
          {this.state.redirect ? (
            <Redirect push to={this.state.redirect} />
          ) : (
            <Row className="justify-content-md-center">
              <Col>
                <TripDetailsDA
                  key={this.state.keyNewTrip}
                  message={message =>
                    this.handleMessage(this.state.keyNewTrip, message)
                  }
                  redirect={path => this.handleRedirect(path)}
                  goBack={() => this.props.history.goBack()}
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
