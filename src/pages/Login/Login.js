import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import styles from "./Login.module.css";
import MyButton from "../../components/ui/button/MyButton";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

const Login = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
        email: '',
        password: '',
        },
        mode: 'onChange'
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values));
        if (!data.payload) return alert('Не вдалося авторизуватися');
        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };

    if (isAuth) {
        return <Navigate to='/'/>
    }
    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Вхід до облікового запису
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    type='email'
                    label="Email"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.email?.message}
                    {...register('email', {required: 'Вкажіть пошту'})}
                    fullWidth
               />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', {required: 'Вкажіть пароль'})}
                    fullWidth
               />
                <MyButton type='submit'>
                    Увійти
                </MyButton>
            </form>  
        </Paper>
    );
};

export default Login;