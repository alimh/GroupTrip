import React from 'react';

export const ErrorView = props => (
  props.error ?
    <div className="error">
      <p>Error!</p>
      <p>{props.error || 'Check console log for additional info'}</p>
    </div>
    :
    <div />
);

export default ErrorView;
