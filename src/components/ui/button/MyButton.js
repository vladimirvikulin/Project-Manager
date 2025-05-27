import React from 'react';
import classes from './MyButton.module.css';

const MyButton = (props) => {
    const { disabled, children, className } = props;

    const buttonClassName = disabled 
        ? `${classes.myBtn} ${classes.disabled} ${className || ''}` 
        : `${classes.myBtn} ${className || ''}`;

    return (
        <button {...props} className={buttonClassName}>
            {children}
        </button>
    );
};

export default MyButton;