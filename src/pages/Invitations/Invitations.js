import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import MyButton from '../../components/ui/button/MyButton';
import styles from './Invitations.module.css';
import { fetchManageInvitation, fetchAuthMe } from '../../redux/slices/auth';
import { selectAuthData } from '../../redux/slices/auth';

const Invitations = () => {
    const dispatch = useDispatch();
    const authData = useSelector(selectAuthData);

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);

    const pendingInvitations = authData?.pendingInvitations?.filter(
        (invite) => invite.status === 'pending'
    ) || [];

    const handleInvitation = (groupId, action) => {
        const groupIdString = groupId._id ? groupId._id.toString() : groupId.toString();
        dispatch(fetchManageInvitation({ groupId: groupIdString, action }))
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
                <MyButton>Назад</MyButton>
            </Link>
            <h2>Ваші запрошення</h2>
            {pendingInvitations.length === 0 ? (
                <div className={styles.noInvitations}>
                    <span className={styles.sadEmoji}>😢</span>
                    <p className={styles.noInvitationsText}>Немає активних запрошень.</p>
                </div>
            ) : (
                <ul className={styles.invitationList}>
                    {pendingInvitations.map((invite) => (
                        <li key={invite.groupId?._id || invite.groupId} className={styles.invitationItem}>
                            <div>
                                <strong>Проєкт: {invite.groupId?.title || 'Невідомий проєкт'}</strong>
                                <p>
                                    Запрошення від:{' '}
                                    {invite.invitedBy?.fullName
                                        ? `${invite.invitedBy.fullName} (${invite.invitedBy.email})`
                                        : 'Невідомий користувач'}
                                </p>
                                <p>Дата: {new Date(invite.invitedAt).toLocaleDateString()}</p>
                            </div>
                            <div className={styles.invitationButtons}>
                                <MyButton
                                    onClick={() => handleInvitation(invite.groupId, 'accept')}
                                    disabled={!invite.groupId || !invite.invitedBy}
                                >
                                    Прийняти
                                </MyButton>
                                <MyButton
                                    onClick={() => handleInvitation(invite.groupId, 'decline')}
                                    disabled={!invite.groupId || !invite.invitedBy}
                                >
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