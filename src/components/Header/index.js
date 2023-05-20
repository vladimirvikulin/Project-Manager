import React from 'react';
import styles from './Header.module.css';
import Container from '@mui/material/Container';
import MyButton from '../ui/button/MyButton';
import { Link } from "react-router-dom";

export const Header = () => {
  const isAuth = false;

  const onClickLogout = () => {};

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
                  <MyButton>Створити аккаунт</MyButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};