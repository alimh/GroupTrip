/* eslint react/no-array-index-key: "off" */

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { LinkContainer } from 'react-router-bootstrap';
import { LoginInfo } from '../components/LoginInfo';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { MessageProvider } from '../components/MessageContext';

const Logo = (
  className = 'd-inline-block align-center',
  size = '80px',
  fillColor = '#4C6E97',
  accentColor = '#FF7D1E',
) => (
    // eslint-disable-next-line react/jsx-indent
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      style={{ height: size, width: size }}
    >
      <path
        fill={fillColor}
        d="M0 121.6v268.8h512V121.6H0zM217.6 352H38.4v-76.8h47.064L76.8 326.4h25.6l34.659-51.2H160c10.604 0 19.2-8.596 19.2-19.2s-8.596-19.2-19.2-19.2h-22.941L102.4 185.6H76.8l8.664 51.2H38.4V160h179.2v192zm256 0H256V160h217.6v192z"
      />
      <path fill={accentColor} d="M294.4 198.4h140.8v38.4H294.4z" />
      <path fill={accentColor} d="M294.4 275.2h140.8v38.4H294.4z" />
    </svg>
    // eslint-disable-next-line indent
  );

export class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  handleMessage(m) {
    const { messages } = this.state;
    messages.push(m);

    // if current message is a success, remove all other messages
    if (m.variant === 'success') {
      messages.forEach((n) => {
        if (n.variant === 'error') messages.splice(n, 1);
      });
    }

    this.setState({ messages });
    window.scrollTo(0, 0);
  }

  handleClose(i) {
    const { messages } = this.state;
    messages.splice(i, 1);
    this.setState({ messages });
  }

  render() {
    const { children } = this.props;

    const toasts = () => {
      const { messages } = this.state;
      return (
        <Container>
          {messages.length > 0 ? <br /> : <div />}
          {messages.map((m, n) => (
            <Row key={n}>
              <Col key={n}>
                <DisappearingAlert
                  key={n}
                  messageObj={m}
                  onDisappear={() => this.handleClose(n)}
                />
              </Col>
            </Row>
          ))}
        </Container>
      );
    };
    return (
      <div
        className="app-container"
        style={{ position: 'relative', minHeight: '100px' }}
      >
        <Navbar bg="light">
          <LinkContainer to="/">
            <Navbar.Brand>
              {Logo()}
              &nbsp;&nbsp;
              <span className="text-primary font-weight-bold">GroupTrip!</span>
            </Navbar.Brand>
          </LinkContainer>
          <LoginInfo sendMessage={(m) => this.handleMessage(m)} />
        </Navbar>
        <div>
          {toasts()}
        </div>
        <MessageProvider value={{ sendMessage: (m) => this.handleMessage(m) }}>
          <div className="app-content">{children}</div>
        </MessageProvider>
        <footer className="page-footer font-small blue pt-4" />
      </div>
    );
  }
}

export default Layout;
