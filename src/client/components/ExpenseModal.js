import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { ExpenseDetail } from '../data-access/ExpenseDetailDA';
import { DisappearingAlert } from './DisappearingAlert';

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
    const { onSuccess = () => false } = this.props;

    this.setState({ messageObj: null });
    onSuccess();
  }

  render() {
    const {
      showModal, onClose, tripId, expenseObj,
    } = this.props;
    const { messageObj } = this.state;

    return (
      <div>
        <Modal show={showModal} onHide={() => onClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Expense Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DisappearingAlert
              messageObj={messageObj}
              disappear={false}
              onDisappear={() => this.handleDisappear()}
            />
            <ExpenseDetail
              tripId={tripId}
              message={(mObj) => {
                this.handleMessage(mObj);
              }}
              expenseObj={expenseObj}
              onCancel={() => onClose()}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ExpenseModal;
