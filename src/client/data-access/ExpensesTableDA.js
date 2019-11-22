import React from "react";
import Axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Auth from "../utils/Auth";
import { LoadingView } from "../components/LoadingView";
import { ExpensesTableView } from "../components/ExpensesTableView";

// import { ExpenseDetail } from '../data-access/ExpenseDetailDA';

export class ExpensesTable extends React.Component {
  constructor(props) {
    super(props);

    const tripId = props.tripId || null;

    this.state = {
      // key: Math.random(),
      // keyEditExpense: null,
      loading: true,
      expenses: null,
      // expenseObjectToEdit: null,
      tripId,
    };
  }

  componentDidMount() {
    this.getExpenses();
  }

  getExpenses() {
    if (this.state.tripId) {
      const authorizationHeader = "bearer ".concat(Auth.getToken());
      Axios.get("/api/expenses/all", {
        headers: {
          Authorization: authorizationHeader,
        },
        params: { id: this.state.tripId },
      })
        .then(response => {
          const { data } = response;
          this.setState({ loading: false, expenses: data });
        })
        .catch(err => {
          this.setState({ loading: false });
          if (this.props.message) this.props.message({ error: err.toString() });
          else throw err;
        });
    }
  }

  showRemoveDialog(id) {
    this.setState({
      idRemove: id,
      showRemoveDialog: true,
    });
  }

  hideRemoveDialog() {
    this.setState({
      idRemove: null,
      showRemoveDialog: false,
    });
  }

  handleRemove() {
    const payload = { id: this.state.idRemove };
    const authorizationHeader = "bearer ".concat(Auth.getToken());
    Axios.post("/api/expenses/remove", payload, {
      headers: { Authorization: authorizationHeader },
    })
      .then(() => {
        this.props.message({
          success: "Removed Expense",
        });
      })
      .catch(err => {
        if (this.props.message) this.props.message({ error: err.toString() });
        else throw err;
        this.setState({ showRemoveDialog: false });
      });
  }

  handleEdit(n) {
    // remove active from the others and disable buttons
    const expenses = this.state.expenses.map(e => ({
      ...e,
      buttonsDisabled: true,
      active: false,
    }));
    expenses[n].active = true;

    this.setState({
      //      keyEditExpense: Math.random(),
      //      expenseObjectToEdit: this.state.expenses[n],
      expenses,
    });
    this.props.onEdit(this.state.expenses[n]);
  }

  render() {
    const TableView =
      this.state.expenses !== null && this.state.expenses.length > 0 ? (
        <div>
          <ExpensesTableView
            expenses={this.state.expenses}
            onRemove={id => this.showRemoveDialog(id)}
            onEdit={n => this.handleEdit(n)}
          />

          <Modal show={this.state.showRemoveDialog}>
            <Modal.Body>
              Are you sure you want to remove this expense?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.hideRemoveDialog()}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={e => this.handleRemove(e)}>
                Remove
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <div />
      );

    if (this.state.loading) return <LoadingView />;
    return TableView;
  }
}

export default ExpensesTable;
