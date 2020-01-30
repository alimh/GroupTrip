import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { InputBox } from './FormComponents';
import { checkNotBlankError } from '../utils/FormValidation';

export class SettingsViewWithNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: props.settings,
      newValue: '',
      newLabel: props.newLabel || '',
      error: false,
      dirty: false,
    };
  }

  handleChange(newValue) {
    const { onUpdate } = this.props;
    onUpdate(newValue);
    this.setState({ newValue, dirty: newValue !== '' });
  }

  sendNewValue(e) {
    e.preventDefault();
    const { newValue } = this.state;
    const { onNew } = this.props;

    const error = checkNotBlankError(newValue);
    if (!error) {
      this.setState({ newValue: '', error: false, dirty: false });
      onNew(newValue);
    } else {
      this.setState({ error });
    }
  }

  render() {
    const noFormat = (t) => t;
    const { formatDirty = noFormat, formatRemove = noFormat } = this.props;
    const {
      settings, newValue, error, dirty, newLabel,
    } = this.state;
    const { onRemove } = this.props;

    return (
      <div>
        {
          settings.length > 0
            ? (
              <>
                <ListGroup>
                  {settings.map((value, i) => (
                    <ListGroup.Item key={value.id}>
                      {!value.active
                        ? formatRemove(value.label)
                        : value.unsaved
                          ? formatDirty(value.label)
                          : value.label}
                      <Button
                        className="float-right"
                        variant="outline-warning"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          onRemove(i);
                        }}
                      >
                        {value.active ? 'x' : 'Reenable'}
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            ) : <div />
        }
        <InputBox
          id="New"
          name=""
          placeholder={newLabel}
          value={newValue}
          onUpdate={(nv) => this.handleChange(nv)}
          errMsg={error}
          appendButton={(
            <Button
              variant={dirty ? 'primary' : 'outline-secondary'}
              onClick={(e) => this.sendNewValue(e)}
            >
              Add
            </Button>
          )}
        />
      </div>
    );
  }
}

export default SettingsViewWithNew;
