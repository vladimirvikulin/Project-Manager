import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import styles from "./Login.module.css";
import MyButton from "../../components/ui/button/MyButton";
import { fetchAuth, selectIsAuth, selectAuthError } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const isAuth = useSelector(selectIsAuth);
    const authError = useSelector(selectAuthError);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const { 
        register, 
        handleSubmit, 
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
        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
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
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message || " "}
                    {...register('email', {
                        required: 'Вкажіть пошту',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Невірний формат пошти'
                        }
                    })}
                    fullWidth
                />
                <div className={styles.passwordFieldWrapper}>
                    <TextField
                        className={styles.field}
                        label="Пароль"
                        type={showPassword ? 'text' : 'password'}
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message || " "}
                        {...register('password', {
                            required: 'Вкажіть пароль',
                            minLength: {
                                value: 5,
                                message: 'Пароль повинен містити мінімум 5 символів'
                            }
                        })}
                        fullWidth
                    />
                    <button
                        type="button"
                        className={styles.eyeIcon}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                        <span className={styles.tooltip}>{showPassword ? 'Приховати пароль' : 'Показати пароль'}</span>
                    </button>
                </div>
                {authError && (
                    <div className={styles.errorMessage}>
                        {authError}
                    </div>
                )}
                <MyButton disabled={!isValid} type='submit' className={styles.largeButton}>
                    Увійти
                </MyButton>
            </form>  
        </Paper>
    );
};

export default Login;