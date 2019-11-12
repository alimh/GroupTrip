import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';

export class DisappearingAlert extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = !prevState.expired ? nextProps : {};

    return { ...newState, expired: false };
  }

  constructor(props) {
    super(props);

    this.state = {
      msg: null,
      disappear: true,
      timeout: 5000,
      expired: false,
      variant: 'secondary',
      heading: null,
    };
  }

  componentDidUpdate() {
    if (this.state.msg && this.state.disappear) {
      setTimeout(() => this.expire(), this.state.timeout);
    }
  }

  expire() {
    this.setState({ msg: null, expired: true });
    if (this.props.onDisappear) this.props.onDisappear();
  }

  render() {
    return (
      <Collapse in={this.state.msg != null}>
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
