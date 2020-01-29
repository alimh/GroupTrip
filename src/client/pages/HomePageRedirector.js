import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import { AllTripsDA } from '../data-access/AllTripsDA';
import Auth from '../utils/Auth';

import MessageContext from '../components/MessageContext';

export class HomePageRedirector extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messageObj: props.messageObj || null };
  }

  componentDidMount() {
    const { messageObj } = this.state;
    const { sendMessage } = this.context;

    if (messageObj) sendMessage(messageObj);
  }

  render() {
    const rednerNotLoggedIn = () => (
      <div>
        <Container>
          <CardDeck className="text-center">
            <Card border="light" style={{ alignItems: 'center' }}>
              <Card.Img style={{ width: '80px' }} variant="top" src="/icon-globe.png" />
              <Card.Body>
                <Card.Title>Planning a trip with a group?</Card.Title>
                <Card.Text>When you&apos;re traveling in a group, splitting the expenses can be a chore. Just start trip on GroupTrip!</Card.Text>
              </Card.Body>
            </Card>
            <Card border="light" style={{ alignItems: 'center' }}>
              <Card.Img style={{ width: '80px' }} variant="top" src="/icon-money.png" />
              <Card.Body>
                <Card.Title>Don&apos;t worry about who spends what.</Card.Title>
                <Card.Text>Everyone can add their own expenses and choose who splits what.</Card.Text>
              </Card.Body>
            </Card>
            <Card border="light" style={{ alignItems: 'center' }}>
              <Card.Img style={{ width: '80px' }} variant="top" src="/icon-bill.png" />
              <Card.Body>
                <Card.Title>Get a bill at the end. Easy!</Card.Title>
                <Card.Text>Get a simple &quot;payback&quot; list during and at the end of the trip.</Card.Text>
              </Card.Body>
            </Card>
          </CardDeck>
          <br />
          <Row className="justify-content-md-center">
            <Col className="text-center">
              <LinkContainer to="/newuser">
                <Button>Sign up to get started</Button>
              </LinkContainer>
            </Col>
          </Row>
        </Container>
      </div>
    );

    const renderLoggedIn = () => (
      <Container>
        <h3>Get Started</h3>
        <Row>
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

    const jumbotronStyle = {
      position: 'relative',
      background: 'url("/jumbotron.jpg") center center',
      opacity: 0.8,
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      color: '#fff',
    };
    return (
      <div className="home">
        <div style={{ background: 'rgba(0, 0, 255, .5)' }}>
          <Jumbotron style={jumbotronStyle}>
            <Container>
              <Row>
                <h2
                  className="display-3"
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Share Costs Between Friends
                </h2>
              </Row>
              <Row>
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

HomePageRedirector.contextType = MessageContext;

export default HomePageRedirector;
