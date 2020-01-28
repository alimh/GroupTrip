import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';

export class DisappearingAlert extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // if this is called because the timer finished, then delete the message
    if (prevState.show && prevState.expired) {
      return {
        show: false,
      };
    }

    // if a new message is received, reset...
    if (nextProps.messageObj) {
      const getVariant = () => {
        if (nextProps.messageObj.variant === 'success') return 'success';
        if (nextProps.messageObj.variant === 'error') return 'danger';
        if (nextProps.messageObj.variant === 'warning') return 'warning';
        return 'secondary';
      };
      const variant = getVariant();

      const { messageObj, ...options } = nextProps;
      const defaults = {
        msg: messageObj.text || '',
        heading: messageObj.heading || '',
        variant,
        timeout: 3000,
        disappear: variant !== 'danger',
      };

      return {
        ...defaults,
        ...options,
        messageObj: null,
        expired: false,
        timerStarted: false,
        show: true,
      };
    }

    return false;
  }

  constructor() {
    super();

    this.state = {
      show: false,
    };
  }

  expire() {
    const { onDisappear = () => false } = this.props;
    this.setState({ expired: true });
    onDisappear();
  }

  render() {
    const {
      disappear, expired, show, timeout, variant, heading, msg,
    } = this.state;
    const { onDisappear = () => false } = this.props;

    if (disappear && !expired && show) {
      setTimeout(() => this.expire(), timeout);
    }
    return (
      <Collapse in={show}>
        <div>
          <Alert variant={variant} dismissible onClose={() => onDisappear()}>
            <Alert.Heading>{heading}</Alert.Heading>
            <p>{msg}</p>
          </Alert>
        </div>
      </Collapse>
    );
  }
}

export default DisappearingAlert;
