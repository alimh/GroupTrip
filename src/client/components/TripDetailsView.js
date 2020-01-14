import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { SettingsViewWithNew } from './SettingsViewWithNew';
import { InputBox } from './FormComponents';
import { checkNotBlankError } from '../utils/FormValidation';

export class TripDetailsView extends React.Component {
  constructor(props) {
    super(props);

    const blankTripObj = {
      name: '',
      categories: [],
      travelers: [],
      tripId: null
    };

    const resetTripObj = props.tripObj
      ? {
        ...props.tripObj,
        categories: [...props.tripObj.categories],
        travelers: [...props.tripObj.travelers]
      }
      : { ...blankTripObj, categories: [], travelers: [] };

    this.state = {
      resetTripObj,
      tripObj: props.tripObj || blankTripObj,
      keys: { travelers: Math.random(), categories: Math.random() },
      errors: { name: false },
      errorChecks: {
        name: f => checkNotBlankError(f)
      },
      unsavedName: false
    };
  }

  handleUpdateName(name) {
    const tripObj = { ...this.state.tripObj, name };
    this.setState({ tripObj, unsaved: true });
  }

  handleNewSetting(settingGroup, newValue) {
    const newSetting = this.state.tripObj[settingGroup];
    newSetting[newSetting.length] = {
      label: newValue,
      id: newSetting.length,
      active: true,
      unsaved: true
    };

    const tripObj = { ...this.state.tripObj, [settingGroup]: newSetting };
    this.setState({ tripObj, unsaved: true });
  }

  handleRemoveSetting(settingGroup, i) {
    const currentSetting = this.state.tripObj[settingGroup];
    const newSettingItem = {
      ...currentSetting[i],
      active: !currentSetting[i].active,
      unsaved: true
    };
    const newSetting = currentSetting;
    newSetting[i] = newSettingItem;
    const tripObj = { ...this.state.tripObj, [settingGroup]: newSetting };
    this.setState({ tripObj, unsaved: true });
  }

  handleSave(e) {
    e.preventDefault();

    const { errors } = this.state;

    // loop through error checks and make sure they are all false
    const error = Object.keys(this.state.errorChecks).reduce((acc, field) => {
      errors[field] = this.state.errorChecks[field](this.state.tripObj[field]);
      return acc || errors[field] !== false;
    }, false);

    if (error) this.setState({ errors, unsavedName: true });
    else {
      const categories = this.state.tripObj.categories.map((c) => {
        const { unsaved, ...rest } = c;
        return rest;
      });
      const travelers = this.state.tripObj.travelers.map((c) => {
        const { unsaved, ...rest } = c;
        return rest;
      });
      this.props.onSave({ ...this.state.tripObj, categories, travelers });
      this.setState({ unsavedName: false });
    }
  }

  handleRemove(e) {
    e.preventDefault();

    this.props.onRemove();
    this.setState({ unsavedName: false });
  }
  showConfirmRemoveButton(e) {
    e.preventDefault();

    this.setState({ confirmRemove: true });
  }

  handleCancel(e) {
    e.preventDefault();

    if (this.state.confirmRemove) {
      this.setState({ confirmRemove: false });
    } else {
      const newTripObj = {
        ...this.state.resetTripObj,
        categories: [...this.state.resetTripObj.categories],
        travelers: [...this.state.resetTripObj.travelers]
      };
      this.setState({
        tripObj: newTripObj,
        keys: { travelers: Math.random(), categories: Math.random() }
      });
    }
  }

  render() {
    const removeButton = () => (
      <Button
        key="remove-button"
        variant="outline-danger"
        disabled={this.state.tripObj.tripId === null}
        onClick={e => this.showConfirmRemoveButton(e)}
      >
        Remove
      </Button>
    );
    const confirmRemoveButton = () => (
      <Button
        key="confirm-remove-button"
        variant="danger"
        onClick={e => this.handleRemove(e)}
      >
        Confirm
      </Button>
    );

    const removeButtonSelector = () => {
      if (!this.state.confirmRemove) {
        return removeButton();
      }
      if (this.state.confirmRemove) {
        return confirmRemoveButton();
      }
      return true;
    };

    const saveButtonSelector = () =>
      (!this.state.confirmRemove ? (
        <Button
          className="float-right"
          key="save-button"
          variant="primary"
          disabled={!this.state.unsaved}
          onClick={e => this.handleSave(e)}
        >
          Save
        </Button>
      ) : (
        <div key="blank-save-button" />
      ));

    const cancelButton = () => (
      <Button
        className="float-right"
        key="cancel-button"
        variant="outline-secondary"
        onClick={e => this.handleCancel(e)}
      >
        Cancel
      </Button>
    );

    return (
      <div>
        <Card border="light">
          <Card.Body>
            <Card.Title>Trip Settings</Card.Title>
            <Form onSubmit={e => e.preventDefault()}>
              <InputBox
                id="TripName"
                label="Give a name for your trip"
                onUpdate={name => this.handleUpdateName(name)}
                value={this.state.tripObj.name}
                errMsg={this.state.errors.name}
                formatLabel={t => (this.state.unsavedName ? <i>{t}</i> : t)}
              />
              <Form.Group controlId="travelers">
                <Form.Label>Who is going on the trip?</Form.Label>
                <SettingsViewWithNew
                  key={this.state.keys.travelers}
                  settings={this.state.tripObj.travelers}
                  onNew={newValue =>
                    this.handleNewSetting('travelers', newValue)
                  }
                  onRemove={i => this.handleRemoveSetting('travelers', i)}
                  formatDirty={t => <i>{t}</i>}
                  formatRemove={t => <del>{t}</del>}
                />
              </Form.Group>
              <Form.Group controlId="categories">
                <Form.Label>Add some categories:</Form.Label>
                <SettingsViewWithNew
                  key={this.state.keys.categories}
                  settings={this.state.tripObj.categories}
                  onNew={newValue =>
                    this.handleNewSetting('categories', newValue)
                  }
                  onRemove={i => this.handleRemoveSetting('categories', i)}
                  formatDirty={t => <i>{t}</i>}
                  formatRemove={t => <del>{t}</del>}
                />
              </Form.Group>
              <Row>
                <Col xs={4}>{removeButtonSelector()} </Col>
                <Col>
                  {cancelButton()}
                  <span className="float-right">&nbsp;</span>
                  {saveButtonSelector()}
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default TripDetailsView;
