import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import { deSnake } from 'utility';
import styles from './ButtonGarden.css';

const ButtonGarden = ({ buttonNames, selectedButton, onClick }) => (
  <div className={styles.buttonContainer}>
    {buttonNames.map((buttonName, index) => (
      <FlatButton
        onClick={() => onClick(buttonName)}
        className={selectedButton === buttonName ? styles.selectedButton : styles.button}
        key={index}
      >
        <span className={styles.buttonText}>{deSnake(buttonName)}</span>
      </FlatButton>
    ))}
  </div>
);

const { arrayOf, string, func } = React.PropTypes;

ButtonGarden.propTypes = {
  buttonNames: arrayOf(string),
  selectedButton: string,
  onClick: func,
};

export default withRouter(ButtonGarden);
