import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import MyButton from '../ui/button/MyButton';
import MyModal from '../ui/modal/MyModal';
import MyCheckboxList from '../ui/checkbox/MyCheckboxList';
import styles from './EditPermissionsForm.module.css';
import { fetchUpdatePermissions, fetchGroups } from '../../redux/slices/groups';
import { FaPencilAlt } from 'react-icons/fa';

const EditPermissionsForm = ({ groupId, memberId, initialPermissions, updatePermissionsState }) => {
    const dispatch = useDispatch();
    const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
    const [permissions, setPermissions] = useState(initialPermissions);

    const permissionOptions = [
        { value: 'canAddTasks', name: 'Додавати задачі' },
        { value: 'canEditTasks', name: 'Редагувати задачі' },
        { value: 'canDeleteTasks', name: 'Видаляти задачі' },
    ];

    const getSelectedPermissions = () => {
        const selected = [];
        if (permissions.canAddTasks) selected.push('canAddTasks');
        if (permissions.canEditTasks) selected.push('canEditTasks');
        if (permissions.canDeleteTasks) selected.push('canDeleteTasks');
        return selected;
    };

    const handlePermissionChange = (selectedPermissions) => {
        const updatedPermissions = {
            canAddTasks: selectedPermissions.includes('canAddTasks'),
            canEditTasks: selectedPermissions.includes('canEditTasks'),
            canDeleteTasks: selectedPermissions.includes('canDeleteTasks'),
        };
        setPermissions(updatedPermissions);
    };

    const savePermissions = () => {
        dispatch(fetchUpdatePermissions({
            groupId,
            userId: memberId,
            canAddTasks: permissions.canAddTasks,
            canEditTasks: permissions.canEditTasks,
            canDeleteTasks: permissions.canDeleteTasks,
        }))
            .then(({ payload }) => {
                alert('Дозволи успішно оновлено');
                dispatch(fetchGroups());
                updatePermissionsState(memberId, permissions);
                setPermissionsModalVisible(false);
            })
            .catch((error) => {
                alert(error.response?.data?.message || 'Помилка при оновленні дозволів');
            });
    };

    return (
        <>
            <button
                onClick={() => setPermissionsModalVisible(true)}
                className={styles.editPermissionsButton}
                aria-label="Редагувати дозволи"
            >
                <FaPencilAlt />
                <span className={styles.tooltip}>Редагувати дозволи</span>
            </button>
            <MyModal visible={permissionsModalVisible} setVisible={setPermissionsModalVisible}>
                <div className={styles.permissionsForm}>
                    <h3>Редагувати дозволи</h3>
                    <MyCheckboxList
                        options={permissionOptions}
                        value={getSelectedPermissions()}
                        onChange={handlePermissionChange}
                        label="Дозволи:"
                    />
                    <MyButton onClick={savePermissions}>
                        Зберегти
                    </MyButton>
                </div>
            </MyModal>
        </>
    );
};

export default EditPermissionsForm;