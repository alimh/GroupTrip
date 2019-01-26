import React from 'react';

export const SuccessView = props => (
  props.msg ?
    <div className="success">
      <p>Success!</p>
      <p>{props.msg}</p>
    </div>
    :
    <div />
);

export default SuccessView;
