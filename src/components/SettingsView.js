import React from 'react';
import { FormBuilder } from './FormComponents';

export const SettingsView = (props) => {
  const {
    settings, onNew, onRemove,
  } = props;
  const categories = Object.keys(settings);

  const settingsList = category => (
    <div key={category}>
      <strong>{category}</strong>
      <ul>
        {
            settings[category].map(i => (
              <li key={i.id}>
                {i.value}
                &nbsp;
                <button
                  value="x"
                  onClick={() => onRemove(i.id)}
                />
              </li>
            ))
        }
        <li key="new">
          <FormBuilder
            fields={[{
                        id: category.concat('New'),
                        name: '',
                        placeholder: 'New '.concat(category),
                    }]}
            onSave={fieldValues => onNew({
                        category,
                        value: fieldValues[category.concat('New')],
                    })}
          />
        </li>
      </ul>
    </div>
  );

  return (
    <div>
      {categories.map(c => settingsList(c))}
    </div>
  );
};

export default SettingsView;
