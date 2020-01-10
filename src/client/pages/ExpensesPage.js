import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { ExpensesTable } from '../data-access/ExpensesTableDA';
import { ExpenseModal } from '../components/ExpenseModal';

export class ExpensesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyNewExpense: null,
      keyExpenseList: Math.random(),
      tripId: props.tripId || null,
      activeExpenseObject: null
    };
  }

  handleEdit(expObjToEdit) {
    this.setState({
      activeExpenseObject: expObjToEdit
    });
  }

  handleCloseModal() {
    this.setState({
      keyNewExpense: null,
      activeExpenseObject: null
      // keyExpenseList: Math.random(), // force re-render
    });
  }

  handleAddExpense() {
    this.setState({
      keyNewExpense: Math.random()
    });
  }

  render() {
    return (
      <div className="home">
        <Container>
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
            <Col>
              <h3>Expenses</h3>
              <ExpensesTable
                key={this.state.keyExpenseList}
                tripId={this.state.tripId}
                onEdit={expObjToEdit => this.handleEdit(expObjToEdit)}
                active={this.state.activeExpenseObject}
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
              activeExpenseObject: null,
              keyNewExpense: null
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

export default ExpensesPage;
