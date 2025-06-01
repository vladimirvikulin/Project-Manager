import React from 'react';
import styles from './Header.module.css';
import Container from '@mui/material/Container';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import { FaEnvelope, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaUser, FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar, showMenuButton = true }) => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const onClickLogout = () => {
        if (window.confirm('Ви дійсно хочете вийти?')) {
            dispatch(logout());
            window.localStorage.removeItem('token');
        }
    };

    return (
        <div className={styles.root}>
            <Container maxWidth={false}>
                <div className={styles.inner}>
                    <Link className={styles.logo} to="/">
                        <div>Management-App</div>
                    </Link>
                    <div className={styles.buttons}>
                        {showMenuButton && (
                            <button onClick={toggleSidebar} className={styles.iconButton} aria-label="Відкрити бокову панель">
                                <FaBars />
                                <span className={styles.tooltip}>Відкрити меню</span>
                            </button>
                        )}
                        {isAuth ? (
                            <>
                                <Link to="/profile">
                                    <button className={styles.iconButton} aria-label="Профіль">
                                        <FaUser />
                                        <span className={styles.tooltip}>Профіль</span>
                                    </button>
                                </Link>
                                <Link to="/invitations">
                                    <button className={styles.iconButton} aria-label="Запрошення">
                                        <FaEnvelope />
                                        <span className={styles.tooltip}>Запрошення</span>
                                    </button>
                                </Link>
                                <button onClick={onClickLogout} className={styles.iconButton} aria-label="Вийти">
                                    <FaSignOutAlt />
                                    <span className={styles.tooltip}>Вийти</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className={styles.iconButton} aria-label="Увійти">
                                        <FaSignInAlt />
                                        <span className={styles.tooltip}>Увійти</span>
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className={styles.iconButton} aria-label="Створити акаунт">
                                        <FaUserPlus />
                                        <span className={styles.tooltip}>Зареєструватися</span>
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Header;