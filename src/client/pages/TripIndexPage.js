import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
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
      showShare: true,
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

  handleCloseShare() {
    this.setState({ showShare: false });
  }

  render() {
    const {
      showShare, activeExpenseObject, keyNewExpense, keyLog, keyExpenseList, tripId,
    } = this.state;

    return (
      <>
        <Container>
          <Row>
            <Col>
              <Alert
                variant="info"
                dismissible
                onClose={() => this.handleCloseShare()}
                show={showShare}
              >
                <Alert.Heading>Share this trip with your friends:</Alert.Heading>
                {window.location.href}
              </Alert>
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
                    activeExpenseObject !== null
                    || keyNewExpense !== null
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
              <h3>Recent Expenses</h3>
              <br />
              <ExpensesList
                key={keyExpenseList}
                tripId={tripId}
                onEdit={(expObjToEdit) => this.handleEdit(expObjToEdit)}
                active={activeExpenseObject}
              />
            </Col>
            <Col sm>
              <h3>Activity</h3>
              <Log
                key={keyLog}
                tripId={tripId}
                onView={(exp) => this.handleEdit(exp)}
              />
            </Col>
          </Row>
        </Container>
        <ExpenseModal
          tripId={tripId}
          expenseObj={activeExpenseObject}
          onClose={() => this.handleCloseModal()}
          onSuccess={() => this.setState({
            keyExpenseList: Math.random(),
            keyLog: Math.random(),
            activeExpenseObject: null,
            keyNewExpense: null,
          })}
          showModal={
            activeExpenseObject !== null
            || keyNewExpense !== null
          }
        />
      </>
    );
  }
}

export default TripIndexPage;
