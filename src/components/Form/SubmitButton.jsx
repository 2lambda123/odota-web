import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default ({ submitForm, label = 'submit', style }) => (
  <RaisedButton
    label={label}
    onClick={submitForm}
    style={style}
    primary
  />
);
