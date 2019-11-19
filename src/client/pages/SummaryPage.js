import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { ExpensesList } from '../data-access/ExpensesListDA';
import { ExpenseModal } from '../components/ExpenseModal';
import { ExpenseSummaryDA } from '../data-access/ExpenseSummaryDA';

export class SummaryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      expenseObject: null,
      // keyExpenseList: Math.random(), // force re-render
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
              <h3>Summary</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <ExpensesList
                key={this.state.keyExpenseList}
                tripId={this.state.tripId}
                message={message =>
                  this.handleMessage(this.state.keyExpenseList, message)
                }
                onEdit={expObjToEdit => this.handleEdit(expObjToEdit)}
                apiEndpoint="incomplete"
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <ExpenseSummaryDA
                message={message => this.handleMessage(message)}
                tripId={this.state.tripId}
              />
            </Col>
          </Row>
        </Container>
        {this.state.expenseObject !== null ? (
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

export default SummaryPage;
