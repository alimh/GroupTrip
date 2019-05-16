import React from 'react';
import DissappearingAlert from './DisappearingAlert';

export const LoadingView = () => (
  <DissappearingAlert
    msg="Loading data from the server"
    variant="warning"
    disappear={false}
  />
);

export default LoadingView;
