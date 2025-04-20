import React from 'react';
import styles from './MyModal.module.css';
import PropTypes from 'prop-types';

const MyModal = ({ visible, setVisible, children }) => {
    const { myModal, active, myModalContent } = styles;
    const modalClasses = [myModal, visible && active];
    const closeModal = () => {
        setVisible(false);
    };
    return (
        <div onClick={closeModal} className={modalClasses.join(' ')}>
            <div onClick={(e) => e.stopPropagation()} className={myModalContent}>
                {children}
            </div>
        </div>
    );
};

MyModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default MyModal;