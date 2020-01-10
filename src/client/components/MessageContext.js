import React from 'react';

const MessageContext = React.createContext({});

export const MessageProvider = MessageContext.Provider;
export const MessageConsumer = MessageContext.Consumer;
export const ErrToMessageObj = err => ({
  text: err
    .toString()
    .concat('. ')
    .concat(err.response ? err.response.data : ''),
  variant: 'error'
});

export default MessageContext;
