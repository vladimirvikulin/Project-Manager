import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchUpdateProfile, selectIsAuth, selectAuthData } from '../../redux/slices/auth';
import styles from './Profile.module.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MyButton from '../../components/ui/button/MyButton';
import { FaCamera } from 'react-icons/fa';

const BACKEND_URL = 'http://localhost:5000';

const Profile = () => {
    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector(selectAuthData);
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (userData) {
            setFullName(userData.fullName || '');
            setPhone(userData.phone || '');
            setBio(userData.bio || '');
            setAvatarUrl(userData.avatarUrl ? `${BACKEND_URL}${userData.avatarUrl}` : '');
        }
    }, [userData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('phone', phone);
        formData.append('bio', bio);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        const result = await dispatch(fetchUpdateProfile(formData));
        if (fetchUpdateProfile.fulfilled.match(result)) {
            const updatedUser = result.payload;
            setFullName(updatedUser.fullName || '');
            setPhone(updatedUser.phone || '');
            setBio(updatedUser.bio || '');
            setAvatarUrl(updatedUser.avatarUrl ? `${BACKEND_URL}${updatedUser.avatarUrl}` : '');
            setAvatarFile(null);
        }
    };

    const handleChooseFile = () => {
        fileInputRef.current.click();
    };

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Профіль користувача
            </Typography>
            <div className={styles.profileContent}>
                <div className={styles.avatarSection}>
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Фото профілю"
                            className={styles.avatar}
                            onError={() => setAvatarUrl('')}
                        />
                    ) : (
                        <div className={styles.avatarPlaceholder}>Немає фото</div>
                    )}
                    <button className={styles.changePhotoButton} onClick={handleChooseFile}>
                        <FaCamera />
                        <span className={styles.tooltip}>Змінити фото</span>
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />
                </div>
                <div className={styles.infoSection}>
                    <TextField
                        label="Ім'я"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        fullWidth
                        className={styles.field}
                    />
                    <TextField
                        label="Email"
                        value={userData?.email || ''}
                        disabled
                        fullWidth
                        className={styles.field}
                    />
                    <TextField
                        label="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        className={styles.field}
                    />
                    <TextField
                        label="Опис профілю"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        className={styles.field}
                    />
                    <div className={styles.infoItem}>
                        <Typography variant="body1">
                            Дата реєстрації: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '—'}
                        </Typography>
                    </div>
                    <MyButton onClick={handleSaveProfile} className={styles.saveButton}>
                        Зберегти зміни
                    </MyButton>
                </div>
            </div>
        </Paper>
    );
};

export default Profile;