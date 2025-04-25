import React from 'react';
import MyModal from '../ui/modal/MyModal';
import styles from './UserProfileModal.module.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const BACKEND_URL = 'http://localhost:5000';

const UserProfileModal = ({ visible, setVisible, user }) => {
    if (!user) {
        return null;
    }

    const avatarUrl = user.avatarUrl ? `${BACKEND_URL}${user.avatarUrl}` : '';

    return (
        <MyModal visible={visible} setVisible={setVisible}>
            <Paper classes={{ root: styles.root }}>
                <Typography classes={{ root: styles.title }} variant="h5">
                    Профіль користувача: {user.fullName}
                </Typography>
                <div className={styles.profileContent}>
                    <div className={styles.avatarSection}>
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Фото профілю"
                                className={styles.avatar}
                                onError={() => console.log('Failed to load avatar')}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>Немає фото</div>
                        )}
                    </div>
                    <div className={styles.infoSection}>
                        <div className={styles.infoItem}>
                            <Typography variant="body1">
                                <strong>Ім'я:</strong> {user.fullName || '—'}
                            </Typography>
                        </div>
                        <div className={styles.infoItem}>
                            <Typography variant="body1">
                                <strong>Email:</strong> {user.email || '—'}
                            </Typography>
                        </div>
                        <div className={styles.infoItem}>
                            <Typography variant="body1">
                                <strong>Телефон:</strong> {user.phone || '—'}
                            </Typography>
                        </div>
                        <div className={styles.infoItem}>
                            <Typography variant="body1" classes={{ root: styles.bio }}>
                                <strong>Опис:</strong>{' '}
                                {user.bio || '—'}
                            </Typography>
                        </div>
                        <div className={styles.infoItem}>
                            <Typography variant="body1">
                                <strong>Дата реєстрації:</strong>{' '}
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                            </Typography>
                        </div>
                    </div>
                </div>
            </Paper>
        </MyModal>
    );
};

export default UserProfileModal;