import React from 'react';
import { Prompt } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { SettingsViewWithNew } from './SettingsViewWithNew';
import { InputBox, CheckboxElement } from './FormComponents';
import { checkNotBlankError } from '../utils/FormValidation';

export class TripDetailsView extends React.Component {
  constructor(props) {
    super(props);

    const blankTripObj = {
      name: '',
      categories: [],
      travelers: [],
      id: null,
    };

    const defaultCategories = props.tripObj ? [] : ['Food', 'Travel', 'Accommodations', 'Activities'];

    const resetTripObj = props.tripObj
      ? {
        ...props.tripObj,
        categories: [...props.tripObj.categories],
        travelers: [...props.tripObj.travelers],
      }
      : { ...blankTripObj, categories: [], travelers: [] };

    this.state = {
      resetTripObj,
      defaultCategories,
      resetDefaultCategories: [...defaultCategories],
      tripObj: props.tripObj || blankTripObj,
      keys: { travelers: Math.random(), categories: Math.random() },
      errors: { name: false },
      errorChecks: {
        name: (f) => checkNotBlankError(f),
      },
      unsavedName: false,
      unsaved: false,
      unsavedSettings: null,
    };
  }

  handleUpdateName(name) {
    this.setState((prevState) => ({
      tripObj: { ...prevState.tripObj, name },
      unsaved: true,
      unsavedName: true,
    }));
  }

  handleUpdateSetting(settingGroup, newValue) {
    this.setState((prevState) => ({
      unsavedSettings: { ...prevState.unsavedSettings, [settingGroup]: newValue },
      unsaved: true,
    }));
  }

  handleNewSetting(settingGroup, newValue) {
    const { tripObj } = this.state;
    const newSetting = tripObj[settingGroup];
    newSetting[newSetting.length] = {
      label: newValue,
      id: newSetting.length,
      active: true,
      unsaved: true,
    };

    this.setState((prevState) => ({
      tripObj: { ...prevState.tripObj, [settingGroup]: newSetting },
      unsaved: true,
      unsavedSettings: { ...prevState.unsavedSettings, [settingGroup]: '' },
    }));
  }

  handleNewDefaultSetting(i) {
    const { defaultCategories } = this.state;
    this.handleNewSetting('categories', defaultCategories[i]);
    this.setState((prevState) => {
      const newDefaultCategories = prevState.defaultCategories;
      newDefaultCategories.splice(i, 1);

      return { defaultCategories: newDefaultCategories };
    });
  }

  handleRemoveSetting(settingGroup, i) {
    const { tripObj } = this.state;
    const currentSetting = tripObj[settingGroup];
    const newSettingItem = {
      ...currentSetting[i],
      active: !currentSetting[i].active,
      unsaved: true,
    };
    const newSetting = currentSetting;
    newSetting[i] = newSettingItem;

    this.setState((prevState) => ({
      tripObj: { ...prevState.tripObj, [settingGroup]: newSetting },
      unsaved: true,
    }));
  }

  handleSave(e) {
    e.preventDefault();

    const { errors, errorChecks, tripObj } = this.state;
    const { unsavedSettings: { categories: unsavedCategory = '', travelers: unsavedTraveler = '' } = {} } = this.state;
    const { onSave } = this.props;

    // force save of un-added settings
    if (unsavedCategory !== '') this.handleNewSetting('categories', unsavedCategory);
    if (unsavedTraveler !== '') this.handleNewSetting('travelers', unsavedTraveler);

    // loop through error checks and make sure they are all false
    const error = Object.keys(errorChecks).reduce((acc, field) => {
      errors[field] = errorChecks[field](tripObj[field]);
      return acc || errors[field] !== false;
    }, false);

    if (error) this.setState({ errors, unsavedName: true });
    else {
      const categories = tripObj.categories.map((c) => {
        const { unsaved, ...rest } = c;
        return rest;
      });
      const travelers = tripObj.travelers.map((c) => {
        const { unsaved, ...rest } = c;
        return rest;
      });

      onSave({ ...tripObj, categories, travelers });
      this.setState({ unsavedName: false, unsavedSettings: false, unsaved: false });
    }
  }

  handleRemove(e) {
    e.preventDefault();

    const { onRemove } = this.props;

    onRemove();
    this.setState({ unsavedName: false });
  }

  showConfirmRemoveButton(e) {
    e.preventDefault();

    this.setState({ confirmRemove: true });
  }

  handleCancel(e) {
    e.preventDefault();

    const { confirmRemove, resetTripObj, resetDefaultCategories } = this.state;

    if (confirmRemove) {
      this.setState({ confirmRemove: false });
    } else {
      const newTripObj = {
        ...resetTripObj,
        categories: [...resetTripObj.categories],
        travelers: [...resetTripObj.travelers],
      };
      this.setState({
        tripObj: newTripObj,
        defaultCategories: [...resetDefaultCategories],
        keys: { travelers: Math.random(), categories: Math.random() },
        unsaved: false,
        unsavedName: false,
        unsavedSettings: {},
      });
    }
  }

  render() {
    const {
      tripObj: {
        id, name, travelers, categories,
      },
      confirmRemove, unsaved, errors, unsavedName, keys, defaultCategories,
    } = this.state;

    const removeButton = () => (
      <Button
        key="remove-button"
        variant="outline-danger"
        disabled={id === null}
        onClick={(e) => this.showConfirmRemoveButton(e)}
      >
        Remove
      </Button>
    );
    const confirmRemoveButton = () => (
      <Button
        key="confirm-remove-button"
        variant="danger"
        onClick={(e) => this.handleRemove(e)}
      >
        Confirm
      </Button>
    );

    const removeButtonSelector = () => {
      if (!confirmRemove) {
        return removeButton();
      }
      if (confirmRemove) {
        return confirmRemoveButton();
      }
      return true;
    };

    const saveButtonSelector = () => (
      !confirmRemove
        ? (
          <Button
            className="float-right"
            key="save-button"
            variant="primary"
            disabled={!unsaved}
            onClick={(e) => this.handleSave(e)}
          >
            Save
          </Button>
        )
        : (
          <div key="blank-save-button" />
        ));

    const cancelButton = () => (
      <Button
        className="float-right"
        key="cancel-button"
        variant="outline-secondary"
        onClick={(e) => this.handleCancel(e)}
      >
        {confirmRemove ? 'Cancel' : 'Reset'}
      </Button>
    );

    const renderDefaultCategories = () => {
      const options = defaultCategories.map((c, i) => (
        <CheckboxElement
          key={c}
          id={c}
          label={c}
          onUpdate={() => this.handleNewDefaultSetting(i)}
        />
      ));

      return (
        <>
          <h5><small>Select some:</small></h5>
          {options}
          {defaultCategories.length > 0 ? <br /> : <></>}
        </>
      );
    };

    return (
      <>
        <Prompt
          when={unsaved}
          message="You have unsaved changes. Are you sure you want to leave?"
        />
        <Card border="light">
          <Card.Body>
            <Card.Title>Trip Settings</Card.Title>
            <Form onSubmit={(e) => e.preventDefault()}>
              <InputBox
                id="TripName"
                label="Trip Name"
                onUpdate={(newName) => this.handleUpdateName(newName)}
                value={name}
                errMsg={errors.name}
                formatLabel={(t) => (unsavedName ? <i>{t}</i> : t)}
              />
              <hr />
              <Form.Group controlId="travelers">
                <Form.Label>Who is going on the trip?</Form.Label>
                <SettingsViewWithNew
                  key={keys.travelers}
                  settings={travelers}
                  newLabel="new traveler"
                  onUpdate={(newValue) => this.handleUpdateSetting('travelers', newValue)}
                  onNew={(newValue) => this.handleNewSetting('travelers', newValue)}
                  onRemove={(i) => this.handleRemoveSetting('travelers', i)}
                  formatDirty={(t) => <i>{t}</i>}
                  formatRemove={(t) => <del>{t}</del>}
                />
              </Form.Group>
              <hr />
              <Form.Group controlId="categories">
                <Form.Label>Expense categories:</Form.Label>
                {!id ? renderDefaultCategories() : <div />}
                <SettingsViewWithNew
                  key={keys.categories}
                  settings={categories}
                  newLabel={!id ? 'or add your own' : 'new category'}
                  onUpdate={(newValue) => this.handleUpdateSetting('categories', newValue)}
                  onNew={(newValue) => this.handleNewSetting('categories', newValue)}
                  onRemove={(i) => this.handleRemoveSetting('categories', i)}
                  formatDirty={(t) => <i>{t}</i>}
                  formatRemove={(t) => <del>{t}</del>}
                />
              </Form.Group>
              <Row>
                <Col xs={4}>
                  {removeButtonSelector()}
                  {' '}
                </Col>
                <Col>
                  {cancelButton()}
                  <span className="float-right">&nbsp;</span>
                  {saveButtonSelector()}
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default TripDetailsView;
