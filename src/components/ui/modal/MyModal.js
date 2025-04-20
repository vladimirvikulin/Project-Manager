import React from 'react';
import styles from './MyModal.module.css';

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

export default MyModal;