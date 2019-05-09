import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { TripLinks } from '../components/TripLinks';
import { ExpenseDetail } from '../data-access/ExpenseDetailDA';
import { ExpensesList } from '../data-access/ExpensesListDA';

export class TripIndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyNewExpense: Math.random(),
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
    this.setState({ messages: m });

    // if success message came from New Expense, reset both, otherwise just the one it came from
    if (m.success && k === this.state.keyNewExpense) {
      this.setState({
        keyNewExpense: Math.random(),
        keyExpenseList: Math.random(),
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
      messages: { success: null },
      expenseObject: expObjToEdit,
    });
  }

  handleCancel() {
    this.setState({
      keyExpenseList: Math.random(), // forces re-render on expense list
      expenseObject: null,
    });
  }

  render() {
    return (
      <div className="home">
        <TripLinks tripId={this.state.tripId} />
        <Container>
          <DisappearingAlert
            msg={this.state.messages.error}
            variant="danger"
            disappear={false}
          />
          <DisappearingAlert
            msg={this.state.messages.success}
            variant="success"
          />
          <Row>
            <Col>
              <ExpenseDetail
                key={this.state.keyNewExpense}
                tripId={this.state.tripId}
                message={message =>
                  this.handleMessage(this.state.keyNewExpense, message)
                }
                expenseObj={this.state.expenseObject}
                onCancel={() => this.handleCancel()}
                borderVariant={this.state.expenseObject ? 'primary' : null}
              />
            </Col>
            <Col>
              <h3>Expense List</h3>
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
      </div>
    );
  }
}

export default TripIndexPage;
