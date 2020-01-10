import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ExpensesList } from '../data-access/ExpensesListDA';
import { ExpenseModal } from '../components/ExpenseModal';
import { ExpenseSummaryDA } from '../data-access/ExpenseSummaryDA';

export class SummaryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyExpenseList: Math.random(),
      keySummary: Math.random(),
      tripId: props.tripId || null,
      activeExpenseObject: null,
      lengthIncomplete: 0
    };
  }
  handleEdit(expObjToEdit) {
    this.setState({
      activeExpenseObject: expObjToEdit
    });
  }

  handleCloseModal() {
    this.setState({
      activeExpenseObject: null
    });
  }

  handleGetExpenses(exp) {
    this.setState({ lengthIncomplete: exp.length });
  }

  render() {
    return (
      <div className="home">
        <Container>
          <Row>
            <Col>
              <h3>Summary</h3>
              <br />
            </Col>
          </Row>
          <Row>
            <Col>
              {this.state.lengthIncomplete > 0 ? (
                <h4>Expenses that are incomplete</h4>
              ) : (
                <div />
              )}
              <ExpensesList
                key={this.state.keyExpenseList}
                tripId={this.state.tripId}
                onEdit={expObjToEdit => this.handleEdit(expObjToEdit)}
                active={this.state.activeExpenseObject}
                apiEndpoint="incomplete"
                getExpenses={exp => this.handleGetExpenses(exp)}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <h4>Summary Table</h4>
              <ExpenseSummaryDA
                key={this.state.keySummary}
                tripId={this.state.tripId}
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
              keySummary: Math.random(),
              activeExpenseObject: null
            })
          }
          showModal={this.state.activeExpenseObject !== null}
        />
      </div>
    );
  }
}

export default SummaryPage;
