import React from 'react';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class TestPage extends React.Component {
  constructor(props) {
    super(props);

    const { prop1, prop2 = '5' } = props;
    this.state = { prop1, prop2 };
  }

  render() {
    const { prop1, prop2 } = this.state;
    console.log(this.state);
    return (
      <div>
        <h1>{prop1 || 'No Prop'}</h1>
        <h2>{prop2}</h2>
      </div>
    );
  }
}

export default TestPage;
