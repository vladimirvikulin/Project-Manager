import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import MyModal from '../ui/modal/MyModal';
import styles from './InviteUserForm.module.css';
import { fetchInviteUser, fetchGroups } from '../../redux/slices/groups';
import { FaUserPlus } from 'react-icons/fa';

const InviteUserForm = ({ groupId }) => {
    const dispatch = useDispatch();
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const handleInviteUser = (e) => {
        e.preventDefault();
        if (!inviteEmail) {
            alert('Введіть електронну адресу');
            return;
        }
        dispatch(fetchInviteUser({ groupId, email: inviteEmail }))
            .then(({ payload }) => {
                alert(payload.message);
                setInviteEmail('');
                setInviteModalVisible(false);
                dispatch(fetchGroups());
            })
            .catch((error) => {
                alert(error.response?.data?.message || 'Помилка при надсиланні запрошення');
            });
    };

    return (
        <>
            <button className={styles.iconButton} onClick={() => setInviteModalVisible(true)} aria-label="Запросити користувача">
                <FaUserPlus />
                <span className={styles.tooltip}>Запросити користувача</span>
            </button>
            <MyModal visible={inviteModalVisible} setVisible={setInviteModalVisible}>
                <div className={styles.inviteForm}>
                    <h3>Запросити користувача</h3>
                    <form onSubmit={handleInviteUser}>
                        <MyInput
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            type="email"
                            placeholder="Електронна адреса"
                        />
                        <MyButton type="submit">Надіслати запрошення</MyButton>
                    </form>
                </div>
            </MyModal>
        </>
    );
};

export default InviteUserForm;