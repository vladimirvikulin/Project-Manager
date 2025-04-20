import React from 'react';
import classes from './MySelect.module.css';
import PropTypes from 'prop-types';

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

MySelect.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
};


export default MySelect;