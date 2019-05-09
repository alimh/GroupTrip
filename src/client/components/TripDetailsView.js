import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
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
      tripId: null,
    };

    this.state = {
      tripObj: props.tripObj || blankTripObj,
      errors: { name: false },
      errorChecks: {
        name: f => checkNotBlankError(f),
      },
      unsaved: false,
      modalRemove: false,
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
      unsaved: true,
    };

    const tripObj = { ...this.state.tripObj, [settingGroup]: newSetting };
    this.setState({ tripObj });
  }

  handleRemoveSetting(settingGroup, i) {
    const currentSetting = this.state.tripObj[settingGroup];
    const newSettingItem = {
      ...currentSetting[i],
      active: !currentSetting[i].active,
      unsaved: true,
    };
    const newSetting = currentSetting;
    newSetting[i] = newSettingItem;
    const tripObj = { ...this.state.tripObj, [settingGroup]: newSetting };
    this.setState({ tripObj });
  }

  handleSave(e) {
    e.preventDefault();

    const { errors } = this.state;

    // loop through error checks and make sure they are all false
    const error = Object.keys(this.state.errorChecks).reduce((acc, field) => {
      errors[field] = this.state.errorChecks[field](this.state.tripObj[field]);
      return acc || errors[field] !== false;
    }, false);

    if (error) this.setState({ errors, unsaved: true });
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
      this.setState({ unsaved: false });
    }
  }

  handleRemove(e) {
    e.preventDefault();

    this.props.onRemove();
    this.setState({ unsaved: false, modalRemove: false });
  }
  handleModalShow() {
    this.setState({ modalRemove: true });
  }
  handleModalHide() {
    this.setState({ modalRemove: false });
  }

  render() {
    return (
      <div>
        <Card border="light">
          <Card.Body>
            <Card.Title>Trip Settings</Card.Title>
            <Form onSubmit={e => this.handleSave(e)}>
              <InputBox
                id="TripName"
                label="Give a name for your trip"
                onUpdate={name => this.handleUpdateName(name)}
                value={this.state.tripObj.name}
                errMsg={this.state.errors.name}
              />
              <Form.Group controlId="travelers">
                <Form.Label>Who is going on the trip?</Form.Label>
                <SettingsViewWithNew
                  key="travelers"
                  settings={this.state.tripObj.travelers}
                  onNew={newValue =>
                    this.handleNewSetting('travelers', newValue)
                  }
                  onRemove={i => this.handleRemoveSetting('travelers', i)}
                />
              </Form.Group>
              <Form.Group controlId="categories">
                <Form.Label>Add some categories</Form.Label>
                <SettingsViewWithNew
                  key="categories"
                  settings={this.state.tripObj.categories}
                  onNew={newValue =>
                    this.handleNewSetting('categories', newValue)
                  }
                  onRemove={i => this.handleRemoveSetting('categories', i)}
                />
              </Form.Group>
              <Button key="save-button" type="submit" variant="primary">
                Save
              </Button>
              <Button
                key="remove-button"
                type="cancel"
                variant="light"
                disabled={this.state.tripObj.tripId === null}
                onClick={(e) => {
                  e.preventDefault();
                  this.handleModalShow();
                }}
              >
                Remove
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <Modal show={this.state.modalRemove}>
          <Modal.Body>Are you sure you want to remove this trip?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalHide()}>
              Cancel
            </Button>
            <Button variant="danger" onClick={e => this.handleRemove(e)}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default TripDetailsView;
