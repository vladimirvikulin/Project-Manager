import React from 'react';
import classes from './MyButton.module.css';

const MyButton = (props) => {
    const { disabled, children } = props;
  
    const buttonClassName = disabled ? `${classes.myBtn} ${classes.disabled}` : classes.myBtn;
  
    return (
      <button {...props} className={buttonClassName}>
        {children}
      </button>
    );
  };

export default MyButton;