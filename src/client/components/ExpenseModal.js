import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { ExpenseDetail } from '../data-access/ExpenseDetailDA';

export const ExpenseModal = props => (
  <div>
    <Modal show onHide={() => props.onClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Expense Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ExpenseDetail
          tripId={props.tripId}
          message={(message) => {
            props.message(message);
            props.onClose();
          }}
          expenseObj={props.expenseObj}
          onCancel={() => props.onClose()}
        />
      </Modal.Body>
    </Modal>
  </div>
);

export default ExpenseModal;
