import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

export const Layout = props => (
  <div className="app-container">
    <Navbar bg="light">
      <LinkContainer to="/">
        <Navbar.Brand>
          <img
            alt=""
            src="/logo.svg"
            width="60"
            height="60"
            className="d-inline-block align-center"
            style={{
              filter:
                'invert(38%) sepia(42%) saturate(566%) hue-rotate(170deg) brightness(97%) contrast(90%)',
            }}
          />
          &nbsp;&nbsp;
          <span className="text-primary font-weight-bold">GroupTrip!</span>
        </Navbar.Brand>
      </LinkContainer>
    </Navbar>
    <div className="app-content">{props.children}</div>
    <footer className="page-footer font-small blue pt-4" />
  </div>
);

export default Layout;
