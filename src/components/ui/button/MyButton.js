import React from 'react';
import classes from './MyButton.module.css';
import PropTypes from 'prop-types';

const MyButton = (props) => {
    const { disabled, children } = props;
  
    const buttonClassName = disabled ? `${classes.myBtn} ${classes.disabled}` : classes.myBtn;
  
    return (
      <button {...props} className={buttonClassName}>
        {children}
      </button>
    );
  };

MyButton.propTypes = {
    disabled: PropTypes.bool,
    children: PropTypes.node.isRequired,
};
export default MyButton;