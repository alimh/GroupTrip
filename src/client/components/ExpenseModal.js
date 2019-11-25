import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { ExpenseDetail } from '../data-access/ExpenseDetailDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class ExpenseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageObj: null,
    };
  }

  handleMessage(m) {
    const success = m.variant === 'success';
    this.setState({ messageObj: m });
    if (success) {
      setTimeout(() => this.sendSuccess(), 1000);
    }
  }

  sendSuccess() {
    this.setState({ messageObj: null });
    if (this.props.onSuccess) this.props.onSuccess();
  }

  render() {
    return (
      <div>
        <Modal show={this.props.showModal} onHide={() => this.props.onClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Expense Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DisappearingAlert
              messageObj={this.state.messageObj}
              disappear={false}
              onDisappear={() => this.handleDisappear()}
            />
            <ExpenseDetail
              tripId={this.props.tripId}
              message={(messageObj) => {
                this.handleMessage(messageObj);
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
