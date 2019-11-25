import React from 'react';
import DissappearingAlert from './DisappearingAlert';

export const LoadingView = () => (
  <DissappearingAlert
    messageObj={{ text: 'Loading data from the server', variant: 'warning' }}
    disappear={false}
  />
);

export default LoadingView;
