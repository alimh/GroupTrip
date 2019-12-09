import React from 'react';
import { DisappearingAlert } from './DisappearingAlert';
import { LoggedOutMessage } from './LoggedOutMessage';

export const ErrorMessage = (props) => {
  const errorType = props.errorType || null;
  const messageObj = {};
  if (errorType === 401) {
    messageObj.text = LoggedOutMessage();
  } else {
    messageObj.text = props.error;
  }
  messageObj.variant = 'danger';
  return <DisappearingAlert disappear={false} messageObj={messageObj} />;
};

export default ErrorMessage;
