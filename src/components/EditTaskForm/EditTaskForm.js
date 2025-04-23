import React from 'react';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import MyCheckboxList from '../ui/checkbox/MyCheckboxList';
import MySelect from '../ui/select/MySelect';
import MyModal from '../ui/modal/MyModal';
import styles from './EditTaskForm.module.css';

const EditTaskForm = ({ visible, setVisible, value, setValue, duration, setDuration, deadline, setDeadline, dependencies, setDependencies, taskOptions, members, saveTask, setEdit, assignedTo, setAssignedTo }) => {
    const handleSave = () => {
        saveTask();
        setVisible(false);
    };

    const handleCancel = () => {
        setValue('');
        setDuration(1);
        setDeadline('');
        setDependencies([]);
        setAssignedTo('');
        setEdit(null);
        setVisible(false);
    };

    const memberOptions = members.map(member => ({
        value: member._id,
        name: member.fullName || member.email,
    }));

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
                <MySelect
                    value={assignedTo}
                    onChange={setAssignedTo}
                    label="Виконавець (опціонально)"
                    options={memberOptions}
                    defaultOption="Оберіть виконавця"
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