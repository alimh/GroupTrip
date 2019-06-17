import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { ExpensesTable } from '../data-access/ExpensesTableDA';
import { ExpenseDetail } from '../data-access/ExpenseDetailDA';

export class ExpensesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyExpenseList: Math.random(),
      tripId: props.tripId || null,
      messages: {
        success: null,
        error: null,
      },
      expenseObject: null,
    };
  }

  handleMessage(m) {
    // display message
    const messages = {
      ...this.state.messages,
      ...m,
    };
    this.setState({ messages });

    if (m.success) {
      this.setState({
        keyExpenseList: Math.random(),
        expenseObject: null,
      });
    }
  }

  handleEdit(expObjToEdit) {
    this.setState({
      messages: { success: null, error: null },
      expenseObject: expObjToEdit,
    });
  }

  handleCancel() {
    this.setState({
      expenseObject: null,
      keyExpenseList: Math.random(), // force re-render
    });
  }

  render() {
    return (
      <div className="home">
        <Container>
          <DisappearingAlert
            msg={this.state.messages.error}
            variant="danger"
            disapper={false}
          />
          <DisappearingAlert
            msg={this.state.messages.success}
            variant="success"
          />
          <Row>
            <Col>
              <h3>Expenses</h3>
              <ExpensesTable
                key={this.state.keyExpenseList}
                message={message => this.handleMessage(message)}
                tripId={this.state.tripId}
                onEdit={expObjToEdit => this.handleEdit(expObjToEdit)}
              />
            </Col>
          </Row>
        </Container>
        <Modal
          show={this.state.expenseObject !== null}
          onHide={() => this.handleCancel()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ExpenseDetail
              key={this.state.keyNewExpense}
              tripId={this.state.tripId}
              message={message => this.handleMessage(message)}
              expenseObj={this.state.expenseObject}
              onCancel={() => this.handleCancel()}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ExpensesPage;
