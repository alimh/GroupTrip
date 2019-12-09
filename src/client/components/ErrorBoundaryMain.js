import React from 'react';
import { AlertBox } from './AlertBox';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, hasMessageObj: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    if (error.messageObj !== null) {
      this.setState({
        hasMessageObj: true,
        text: error.rmessageObj.text,
        type: error.messageObj.variant
      });
    } else {
      this.setState({
        text: error.toString().concat(info),
        type: 'error'
      });
    }
    console.log(error);
  }

  render() {
    return this.state.hasError ? (
      <div>
        <AlertBox
          disappear={false}
          text={this.state.text}
          type={this.state.type}
        />
        {this.state.hasMessageObj ? this.props.children : <div />}
      </div>
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
