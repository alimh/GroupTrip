import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

export const Layout = props => (
  <div className="app-container">
    <Navbar bg="light" variant="light">
      <LinkContainer to="/">
        <Navbar.Brand>
          <img
            alt=""
            src="./logo.svg"
            width="52"
            height="52"
            className="d-inline-block align-center"
          />
          &nbsp;&nbsp;GroupTrip!
        </Navbar.Brand>
      </LinkContainer>
    </Navbar>
    <div className="app-content">{props.children}</div>
    <footer className="page-footer font-small blue pt-4" />
  </div>
);

export default Layout;
