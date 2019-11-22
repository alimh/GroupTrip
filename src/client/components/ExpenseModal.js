import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { ExpenseDetail } from '../data-access/ExpenseDetailDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class ExpenseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {
        success: null,
        error: null,
      },
    };
  }
  hanldeMessage(m) {
    this.setState({ messages: { ...m } });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Modal show onHide={() => this.props.onClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Expense Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DisappearingAlert
              msg={this.state.messages.error}
              variant="danger"
              onDisappear={() => this.props.onClose()}
            />
            <DisappearingAlert
              msg={this.state.messages.success}
              variant="success"
              onDisappear={() => this.props.onClose()}
            />
            <ExpenseDetail
              tripId={this.props.tripId}
              message={(message) => {
                this.hanldeMessage(message);
              }}
              expenseObj={this.props.expenseObj}
              onCancel={() => this.props.onClose()}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ExpenseModal;
