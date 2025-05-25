import React from 'react';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import MyModal from '../ui/modal/MyModal';
import styles from './EditGroupForm.module.css';

const EditGroupForm = ({ visible, setVisible, group, saveGroup, editTitle, setEditTitle }) => {
    return (
        <MyModal visible={visible} setVisible={setVisible}>
            <div className={styles.editGroupForm}>
                <h3>Редагувати проєкт</h3>
                <MyInput 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)} 
                    type="text" 
                    placeholder="Назва проєкту"
                />
                <div className={styles.editButtons}>
                    <MyButton onClick={saveGroup}>Зберегти</MyButton>
                    <MyButton onClick={() => setVisible(false)}>Скасувати</MyButton>
                </div>
            </div>
        </MyModal>
    );
};

export default EditGroupForm;