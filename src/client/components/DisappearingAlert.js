import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';

export class DisappearingAlert extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // if this is called because the timer finished, then delete the message
    if (prevState.show && prevState.expired) {
      return {
        show: false
      };
    }

    // if a new message is received, reset...
    if (nextProps.messageObj) {
      const getVariant = () => {
        if (nextProps.messageObj.variant === 'success') return 'success';
        else if (nextProps.messageObj.variant === 'error') return 'danger';
        else if (nextProps.messageObj.variant === 'warning') return 'warning';
        return 'secondary';
      };
      const variant = getVariant();

      const { messageObj, ...options } = nextProps;
      const defaults = {
        msg: messageObj.text || '',
        heading: messageObj.heading || '',
        variant,
        timeout: 5000,
        disappear: variant !== 'danger'
      };

      return {
        ...defaults,
        ...options,
        messageObj: null,
        expired: false,
        timerStarted: false,
        show: true
      };
    }

    return false;
  }

  constructor() {
    super();

    this.state = {
      show: false
    };
  }

  expire() {
    this.setState({ expired: true });
    if (this.props.onDisappear) this.props.onDisappear();
  }

  render() {
    if (this.state.disappear && !this.state.expired && this.state.show) {
      setTimeout(() => this.expire(), this.state.timeout);
    }
    return (
      <Collapse in={this.state.show}>
        <div>
          <Alert variant={this.state.variant}>
            <Alert.Heading>{this.state.heading}</Alert.Heading>
            <p>{this.state.msg}</p>
          </Alert>
        </div>
      </Collapse>
    );
  }
}

export default DisappearingAlert;
