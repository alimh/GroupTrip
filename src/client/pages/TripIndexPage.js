import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { ExpensesList } from '../data-access/ExpensesListDA';
import { ExpenseModal } from '../components/ExpenseModal';

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

  handleCloseModal() {
    this.setState({
      keyNewExpense: null,
      expenseObject: null,
      // keyExpenseList: Math.random(), // force re-render
    });
  }

  handleAddExpense() {
    this.setState({
      messages: { success: null, error: null },
      keyNewExpense: Math.random(),
    });
  }

  render() {
    console.log(this.state);
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
            timeout={5000}
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
                  onClick={() => this.handleAddExpense()}
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
        {this.state.expenseObject !== null ||
        this.state.keyNewExpense !== null ? (
          <ExpenseModal
            tripId={this.state.tripId}
            message={message =>
              this.handleMessage(this.state.keyNewExpense, message)
            }
            expenseObj={this.state.expenseObject}
            onClose={() => this.handleCloseModal()}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default TripIndexPage;
