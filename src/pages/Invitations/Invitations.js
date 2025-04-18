import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import MyButton from '../../components/ui/button/MyButton';
import styles from './Invitations.module.css';
import { fetchManageInvitation } from '../../redux/slices/auth';
import { selectAuthData } from '../../redux/slices/auth';

const Invitations = () => {
    const dispatch = useDispatch();
    const authData = useSelector(selectAuthData);

    const pendingInvitations = authData?.pendingInvitations?.filter(
        (invite) => invite.status === 'pending'
    ) || [];

    const handleInvitation = (groupId, action) => {
        dispatch(fetchManageInvitation({ groupId, action }))
            .then(({ payload }) => {
                alert(payload.message);
            })
            .catch((error) => {
                alert(error.response?.data?.message || `Помилка при ${action === 'accept' ? 'прийманні' : 'відхиленні'} запрошення`);
            });
    };

    return (
        <div className={styles.container}>
            <Link to="/">
                <MyButton>Назад до списку</MyButton>
            </Link>
            <h2>Ваші запрошення</h2>
            {pendingInvitations.length === 0 ? (
                <p>Немає активних запрошень.</p>
            ) : (
                <ul className={styles.invitationList}>
                    {pendingInvitations.map((invite) => (
                        <li key={invite.groupId._id} className={styles.invitationItem}>
                            <div>
                                <strong>Група: {invite.groupId.title}</strong>
                                <p>Запрошення від: {invite.invitedBy.fullName} ({invite.invitedBy.email})</p>
                                <p>Дата: {new Date(invite.invitedAt).toLocaleDateString()}</p>
                            </div>
                            <div className={styles.invitationButtons}>
                                <MyButton onClick={() => handleInvitation(invite.groupId._id, 'accept')}>
                                    Прийняти
                                </MyButton>
                                <MyButton onClick={() => handleInvitation(invite.groupId._id, 'decline')}>
                                    Відхилити
                                </MyButton>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Invitations;