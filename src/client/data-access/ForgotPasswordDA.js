/* eslint react/forbid-prop-types: "off" */

import React from 'react';
import Axios from 'axios';
import { FormBuilder } from '../components/FormComponents';
import {
  checkValidEmailError,
  checkNotBlankError,
} from '../utils/FormValidation';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';
import { LoadingView } from '../components/LoadingView';

// 1. Get email address
// 2. Show remidner question and fields for answer, new password, confirm password
// 3. Send
// 4. If correct

export class ForgotPasswordDA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: null,
      keyForm: Math.random(),
      loading: false,
      email: null,
    };
  }

  getQuestion(email) {
    this.setState({ loading: true });
    const { sendMessage } = this.context;

    Axios.get('/auth/question', {
      params: { email },
    })
      .then((res) => {
        this.setState({
          loading: false, question: res.data.question, keyForm: Math.random(), email,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        sendMessage(ErrToMessageObj(err));
      });
  }

  postAnswer(fieldValues) {
    const { reminderAnswer, password } = fieldValues;
    const { email } = this.state;
    const payload = { reminderAnswer, email, password };

    const { onSuccess } = this.props;
    const { sendMessage } = this.context;

    Axios.post('/auth/answer', payload)
      .then(() => {
        onSuccess();
        // sendMessage({
        //   text: 'Password changed',
        //   variant: 'success',
        // });
      })
      .catch((err) => sendMessage(ErrToMessageObj(err)));
  }

  render() {
    const { question, keyForm, loading } = this.state;

    const fieldsEmail = [
      {
        id: 'email',
        label: 'Email',
        errorChecks: (value) => checkValidEmailError(value),
      },
    ];
    const fieldsAnswer = [
      {
        id: 'reminderAnswer',
        label: 'Your Answer',
        inputType: 'password',
      },
      {
        id: 'password',
        label: 'New Password',
        inputType: 'password',
        errorChecks: (value) => checkNotBlankError(value),
      },
      {
        id: 'confirm_password',
        label: 'Confirm New Password',
        inputType: 'password',
      },
    ];

    if (loading) return <LoadingView />;
    return !question
      ? (
        <FormBuilder
          key={keyForm}
          fields={fieldsEmail}
          onSave={(fieldValues) => this.getQuestion(fieldValues.email)}
        />
      )
      : (
        <div>
          <h5>{question}</h5>
          <FormBuilder
            key={keyForm}
            fields={fieldsAnswer}
            onSave={(fieldValues) => this.postAnswer(fieldValues)}
          />
        </div>
      );
  }
}

ForgotPasswordDA.contextType = MessageContext;

export default ForgotPasswordDA;
