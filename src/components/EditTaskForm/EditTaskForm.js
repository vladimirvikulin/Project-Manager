import React from 'react';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import MyCheckboxList from '../ui/checkbox/MyCheckboxList';
import MyModal from '../ui/modal/MyModal';
import styles from './EditTaskForm.module.css';

const EditTaskForm = ({ visible, setVisible, value, setValue, duration, setDuration, deadline, setDeadline, dependencies, setDependencies, taskOptions, saveTask, setEdit }) => {
    const handleSave = () => {
        saveTask();
        setVisible(false);
    };

    const handleCancel = () => {
        setValue('');
        setDuration(1);
        setDeadline('');
        setDependencies([]);
        setEdit(null);
        setVisible(false);
    };

    return (
        <MyModal visible={visible} setVisible={setVisible}>
            <div className={styles.editForm}>
                <h3>Редагувати задачу</h3>
                <MyInput 
                    value={value} 
                    onChange={e => setValue(e.target.value)} 
                    type="text" 
                    placeholder="Назва задачі"
                />
                <MyInput 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)} 
                    type="number" 
                    placeholder="Тривалість (дні)" 
                    min="1"
                />
                <MyInput 
                    value={deadline} 
                    onChange={e => setDeadline(e.target.value)} 
                    type="date" 
                    placeholder="Дедлайн (опціонально)"
                />
                <MyCheckboxList
                    value={dependencies}
                    onChange={setDependencies}
                    label="Залежності (опціонально)"
                    options={taskOptions}
                />
                <div className={styles.editButtons}>
                    <MyButton onClick={handleSave}>Зберегти</MyButton>
                    <MyButton onClick={handleCancel}>Скасувати</MyButton>
                </div>
            </div>
        </MyModal>
    );
};

export default EditTaskForm;