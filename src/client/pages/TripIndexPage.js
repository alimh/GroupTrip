import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { ExpensesList } from '../data-access/ExpensesListDA';
import { ExpenseModal } from '../components/ExpenseModal';
import { Log } from '../data-access/LogDA';

export class TripIndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyNewExpense: null,
      keyExpenseList: Math.random(),
      keyLog: Math.random(),
      tripId: props.tripId || null,
      activeExpenseObject: null,
      messageObj: null,
    };
  }

  handleEdit(expObjToEdit) {
    this.setState({
      activeExpenseObject: expObjToEdit,
    });
  }

  handleCloseModal() {
    this.setState({
      keyNewExpense: null,
      activeExpenseObject: null,
      // keyExpenseList: Math.random(), // force re-render
    });
  }

  handleAddExpense() {
    this.setState({
      keyNewExpense: Math.random(),
    });
  }

  handleMessage(m) {
    this.setState({ messageObj: m });
  }

  render() {
    return (
      <div className="home">
        <Container>
          <Row>
            <Col>
              <DisappearingAlert messageObj={this.state.messageObj} />
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                <ListGroup.Item
                  action
                  variant="primary"
                  onClick={() => this.handleAddExpense()}
                  disabled={
                    this.state.activeExpenseObject !== null ||
                    this.state.keyNewExpense !== null
                  }
                >
                  Add an expense
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm>
              <h3>Most Recent Expenses</h3>
              <br />
              <ExpensesList
                key={this.state.keyExpenseList}
                tripId={this.state.tripId}
                onEdit={expObjToEdit => this.handleEdit(expObjToEdit)}
                active={this.state.activeExpenseObject}
                message={m => this.handleMessage(m)}
              />
            </Col>
            <Col sm>
              <h3>Activity</h3>
              <Log
                key={this.state.keyLog}
                tripId={this.state.tripId}
                message={m => this.handleMessage(m)}
                onView={exp => this.handleEdit(exp)}
              />
            </Col>
          </Row>
        </Container>
        <ExpenseModal
          tripId={this.state.tripId}
          expenseObj={this.state.activeExpenseObject}
          onClose={() => this.handleCloseModal()}
          onSuccess={() =>
            this.setState({
              keyExpenseList: Math.random(),
              keyLog: Math.random(),
              activeExpenseObject: null,
              keyNewExpense: null,
            })
          }
          showModal={
            this.state.activeExpenseObject !== null ||
            this.state.keyNewExpense !== null
          }
        />
      </div>
    );
  }
}

export default TripIndexPage;
