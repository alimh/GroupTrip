import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export const TripLinksBanner = (props) => {
  const linkSettings = '/trips/'.concat(props.tripId).concat('/settings');
  const linkExpenses = '/trips/'.concat(props.tripId).concat('/expenses');
  const linkSummary = '/trips/'.concat(props.tripId).concat('/summary');
  const linkTripIndex = '/trips/'.concat(props.tripId).concat('/home');
  const tripName = props.tripName || 'Trip Home';
  const tripNameTrunc =
    tripName.length > 13 ? tripName.substring(0, 10).concat('...') : tripName;

  return (
    <Navbar expand="lg" bg="primary" variant="dark">
      <Navbar.Brand>{tripNameTrunc}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to={linkTripIndex}>
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          {props.isOwner ? (
            <LinkContainer to={linkSettings}>
              <Nav.Link>Settings</Nav.Link>
            </LinkContainer>
          ) : (
            <div />
          )}
          <LinkContainer to={linkExpenses}>
            <Nav.Link>Expenses</Nav.Link>
          </LinkContainer>
          <LinkContainer to={linkSummary}>
            <Nav.Link>Summary</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TripLinksBanner;
