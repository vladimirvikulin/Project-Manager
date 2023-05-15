import React from 'react';
import classes from './MyModal.module.css'
const MyModal = (props) => {
    const modalClasses = [classes.myModal]
    if (props.visible) {
        modalClasses.push(classes.active)
    }
    return (
        <div onClick={() => props.setVisible(false)} className={modalClasses.join(' ')}>
            <div onClick={(e) => e.stopPropagation()} className={classes.myModalContent}>
                {props.children}
            </div>
        </div>
    );
};

export default MyModal;