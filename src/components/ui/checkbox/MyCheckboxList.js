import React from 'react';
import classes from './MyCheckboxList.module.css';

const MyCheckboxList = ({ options, value, onChange, label }) => {
    const selectedValues = Array.isArray(value) ? value : [];

    const handleCheckboxChange = (optionValue) => {
        if (selectedValues.includes(optionValue)) {
            const newValues = selectedValues.filter(val => val !== optionValue);
            onChange(newValues);
        } else {
            const newValues = [...selectedValues, optionValue];
            onChange(newValues);
        }
    };

    return (
        <div className={classes.checkboxList}>
            <div className={classes.label}>{label}</div>
            <div className={classes.options}>
                {options.length > 0 ? (
                    options.map(option => (
                        <label key={option.value} className={classes.option}>
                            <input
                                type="checkbox"
                                value={option.value}
                                checked={selectedValues.includes(option.value)}
                                onChange={() => handleCheckboxChange(option.value)}
                            />
                            {option.name}
                        </label>
                    ))
                ) : (
                    <div className={classes.noOptions}>Немає доступних задач</div>
                )}
            </div>
        </div>
    );
};

export default MyCheckboxList;