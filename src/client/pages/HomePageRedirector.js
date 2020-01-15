import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { AllTripsDA } from '../data-access/AllTripsDA';
import Auth from '../utils/Auth';

import MessageContext from '../components/MessageContext';

export class HomePageRedirector extends React.Component {
  static contextType = MessageContext;

  constructor(props) {
    super(props);

    this.state = { messageObj: props.messageObj || null };
  }
  componentDidMount() {
    if (this.state.messageObj) this.context.sendMessage(this.state.messageObj);
  }
  render() {
    const rednerNotLoggedIn = () => (
      <Container>
        <h4>
          <Link to="/newuser">Create an account</Link> or{' '}
          <Link to="/account">Login</Link> to get started!
        </h4>
      </Container>
    );

    const renderLoggedIn = () => (
      <Container>
        <h3>Get Started</h3>
        <Row className="justify-content-md-center">
          <Col>
            <ListGroup>
              <LinkContainer to="/new">
                <ListGroup.Item action variant="primary">
                  Start a new trip
                </ListGroup.Item>
              </LinkContainer>
            </ListGroup>
            <br />
            <AllTripsDA />
          </Col>
        </Row>
      </Container>
    );

    // const jumbotronStyle = {
    //   background: '/jumbotron.jpg' // backgroundSize: 'cover'
    // };
    const jumbotronStyle = {
      position: 'relative',
      background: 'url("/jumbotron.jpg") center center',
      opacity: 0.8,
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      color: '#fff'
    };
    return (
      <div className="home">
        <div style={{ background: 'rgba(76, 175, 80, .5)' }}>
          <Jumbotron style={jumbotronStyle}>
            <Container>
              <Row className="justify-content-md-center">
                <h2
                  className="display-3"
                  style={{
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  Share Costs Between Friends
                </h2>
              </Row>
              <Row className="justify-content-md-center">
                <h2 className="display-4" style={{ color: 'white' }}>
                  Stay Friends!
                </h2>
              </Row>
            </Container>
          </Jumbotron>
        </div>
        {Auth.isUserAuthenticated() ? renderLoggedIn() : rednerNotLoggedIn()}
      </div>
    );
  }
}

export default HomePageRedirector;