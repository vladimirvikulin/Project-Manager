import React from 'react';
import EditPermissionsForm from '../EditPermissionsForm/EditPermissionsForm';
import styles from './MembersList.module.css';
import { FaTrash, FaSignOutAlt } from 'react-icons/fa';

const MembersList = ({ members, isOwner, authData, handleRemoveUser, handleLeaveGroup, groupId, permissionsState, updatePermissionsState }) => {
    if (!Array.isArray(members) || members.length === 0) {
        return null;
    }

    return (
        <div className={styles.membersList}>
            <h3>Учасники:</h3>
            <ul>
                {members.map((member) => (
                    member && member._id ? (
                        <li key={member._id} className={styles.memberItem}>
                            <span>{member.fullName} ({member.email})</span>
                            <div className={styles.memberActions}>
                                {authData?._id === member._id.toString() && !isOwner && (
                                    <button
                                        onClick={() => handleLeaveGroup(member._id)}
                                        className={styles.iconButton}
                                        aria-label="Вийти з групи"
                                    >
                                        <FaSignOutAlt />
                                        <span className={styles.tooltip}>Вийти з групи</span>
                                    </button>
                                )}
                                {isOwner && member._id.toString() !== authData?._id && (
                                    <>
                                        <button
                                            onClick={() => handleRemoveUser(member._id)}
                                            className={styles.iconButton}
                                            aria-label="Видалити"
                                        >
                                            <FaTrash />
                                            <span className={styles.tooltip}>Видалити</span>
                                        </button>
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
                                    </>
                                )}
                            </div>
                        </li>
                    ) : null
                ))}
            </ul>
        </div>
    );
};

export default MembersList;