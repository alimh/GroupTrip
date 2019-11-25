import React from 'react';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class TestPage extends React.Component {
  constructor() {
    super();

    this.state = {
      n: 0,
      messageObj: [
        { text: 'message 0' },
        { text: 'message 1', variant: 'success' },
        { text: 'message 2', variant: 'error' },
      ],
    };
  }
  onDisappear() {
    this.setState({ n: this.state.n + 1 });
  }
  render() {
    return (
      <div>
        <DisappearingAlert
          messageObj={this.state.messageObj[this.state.n]}
          onDisappear={() => this.onDisappear()}
        />
      </div>
    );
  }
}

export default TestPage;
