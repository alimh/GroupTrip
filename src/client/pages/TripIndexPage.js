import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { ExpenseDetail } from '../data-access/ExpenseDetailDA';
import { ExpensesList } from '../data-access/ExpensesListDA';

export class TripIndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyNewExpense: null,
      keyExpenseList: Math.random(),
      tripId: props.tripId || null,
      messages: {
        success: null,
        error: null,
      },
      expenseObject: null,
    };
  }

  handleMessage(k, m) {
    // display message
    const messages = {
      ...this.state.messages,
      ...m,
    };
    this.setState({ messages });

    // if success message came from New Expense, reset both, otherwise just the one it came from
    if (m.success && k === this.state.keyNewExpense) {
      this.setState({
        keyNewExpense: null,
        keyExpenseList: Math.random(),
        expenseObject: null,
      });
    }
    if (m.success && k === this.state.keyExpenseList) {
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
      keyNewExpense: null,
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
            onDisappear={() => {
              this.setState({
                messages: { ...this.state.messages, error: null },
              });
            }}
          />
          <DisappearingAlert
            msg={this.state.messages.success}
            variant="success"
            onDisappear={() => {
              this.setState({
                messages: { ...this.state.messages, success: null },
              });
            }}
          />
          <Row>
            <Col>
              <ListGroup>
                <ListGroup.Item
                  action
                  variant="primary"
                  onClick={() =>
                    this.setState({ keyNewExpense: Math.random() })
                  }
                  disabled={!(this.state.messages.error === null)}
                >
                  Add an expense
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <h3>Most Recent Expenses</h3>
              <br />
              <ExpensesList
                key={this.state.keyExpenseList}
                tripId={this.state.tripId}
                message={message =>
                  this.handleMessage(this.state.keyExpenseList, message)
                }
                onEdit={expObjToEdit => this.handleEdit(expObjToEdit)}
              />
            </Col>
          </Row>
        </Container>
        <Modal
          show={
            this.state.expenseObject !== null ||
            this.state.keyNewExpense !== null
          }
          onHide={() => this.handleCancel()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ExpenseDetail
              key={this.state.keyNewExpense}
              tripId={this.state.tripId}
              message={message =>
                this.handleMessage(this.state.keyNewExpense, message)
              }
              expenseObj={this.state.expenseObject}
              onCancel={() => this.handleCancel()}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default TripIndexPage;
