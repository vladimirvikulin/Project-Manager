import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, selectUserProfile } from '../../redux/slices/auth';
import EditPermissionsForm from '../EditPermissionsForm/EditPermissionsForm';
import UserProfileModal from '../UserProfileModal/UserProfileModal';
import styles from './MembersList.module.css';
import { FaTrash, FaSignOutAlt } from 'react-icons/fa';

const MembersList = ({ members, isOwner, authData, handleRemoveUser, handleLeaveGroup, groupId, permissionsState, updatePermissionsState }) => {
    const dispatch = useDispatch();
    const userProfile = useSelector(selectUserProfile);
    const [modalVisible, setModalVisible] = useState(false);

    if (!Array.isArray(members) || members.length === 0) {
        return null;
    }

    const handleViewProfile = (memberId) => {
        dispatch(fetchUserById(memberId))
            .then(() => {
                setModalVisible(true);
            })
            .catch((error) => {
                alert(error.payload || 'Помилка при отриманні даних користувача');
            });
    };

    return (
        <div className={styles.membersList}>
            <h3>Учасники:</h3>
            <ul>
                {members.map((member) => (
                    member && member._id ? (
                        <li key={member._id} className={styles.memberItem}>
                            <span
                                className={styles.memberName}
                                onClick={() => handleViewProfile(member._id)}
                            >
                                {member.fullName} ({member.email})
                            </span>
                            <div className={styles.memberActions}>
                                {authData?._id === member._id.toString() && !isOwner && (
                                    <button
                                        onClick={() => handleLeaveGroup(member._id)}
                                        className={styles.iconButton}
                                        aria-label="Вийти з проєкту"
                                    >
                                        <FaSignOutAlt />
                                        <span className={styles.tooltip}>Вийти з проєкту</span>
                                    </button>
                                )}
                                {isOwner && member._id.toString() !== authData?._id && (
                                    <>
                                        <EditPermissionsForm
                                            groupId={groupId}
                                            memberId={member._id}
                                            initialPermissions={permissionsState[member._id] || {
                                                canAddTasks: false,
                                                canEditTasks: false,
                                                canDeleteTasks: false,
                                            }}
                                            updatePermissionsState={updatePermissionsState}
                                        />
                                        <button
                                            onClick={() => handleRemoveUser(member._id)}
                                            className={styles.iconButton}
                                            aria-label="Видалити"
                                        >
                                            <FaTrash />
                                            <span className={styles.tooltip}>Видалити</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ) : null
                ))}
            </ul>
            <UserProfileModal
                visible={modalVisible}
                setVisible={setModalVisible}
                user={userProfile}
            />
        </div>
    );
};

export default MembersList;