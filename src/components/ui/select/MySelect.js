import React from 'react';
import classes from './MySelect.module.css';

const MySelect = (props) => {
    return (
        <select 
            className={classes.mySelect}
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
        >
            <option disabled value=''>{props.defaultValue}</option>
            {props.options.map(option => 
                <option value={option.value} key={option.value}>
                    {option.name}
                </option>
            )}
        </select>
    );
};

export default MySelect;