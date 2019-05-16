import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export const TripLinksBanner = (props) => {
  const linkSettings = '/trips/'.concat(props.tripId).concat('/settings');
  const linkSummary = '/trips/'.concat(props.tripId).concat('/summary');
  const linkTripIndex = '/trips/'.concat(props.tripId);
  const tripName = props.tripName || 'Trip Home';
  const tripNameTrunc =
    tripName.length > 13 ? tripName.substring(0, 10).concat('...') : tripName;

  return (
    <Navbar collapseOnSelect expand="lg" bg="light">
      <Navbar.Brand href={linkTripIndex} as="div">
        <Link to={linkTripIndex}>{tripNameTrunc}</Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href={linkSettings} as="div">
            <Link to={linkSettings}>Settings</Link>
          </Nav.Link>
          <Nav.Link href={linkSummary} as="div">
            <Link to={linkSummary}>Summary</Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TripLinksBanner;
