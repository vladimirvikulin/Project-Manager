import React from 'react';
import styles from './Header.module.css';
import Container from '@mui/material/Container';
import MyButton from '../ui/button/MyButton';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

const Header = () => {
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
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>My-To-Do-List</div>
          </Link>
          <div>
            {isAuth ? (
              <>
                <MyButton onClick={onClickLogout}>
                  Вийти
                </MyButton>
              </>
            ) : (
              <>
                <Link to="/login">
                  <MyButton>Увійти</MyButton>
                </Link>
                <Link to="/register">
                  <MyButton>Створити акаунт</MyButton>
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