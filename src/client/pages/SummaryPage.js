import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { ExpenseSummaryDA } from '../data-access/ExpenseSummaryDA';

export class SummaryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: props.tripId || null,
      messages: {
        success: null,
        error: null,
      },
    };
  }

  handleMessage(m) {
    // display message
    this.setState({ messages: m });
  }

  render() {
    return (
      <div className="home">
        <Container>
          <DisappearingAlert
            msg={this.state.messages.error}
            variant="danger"
            disapper={false}
          />
          <DisappearingAlert
            msg={this.state.messages.success}
            variant="success"
          />
          <Row>
            <Col>
              <h3>Summary</h3>
              <ExpenseSummaryDA
                message={message => this.handleMessage(message)}
                tripId={this.state.tripId}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SummaryPage;
