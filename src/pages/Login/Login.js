import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import styles from "./Login.module.css";
import MyButton from "../../components/ui/button/MyButton";

const Login = () => {
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вхід до облікового запису
      </Typography>
      <TextField
        className={styles.field}
        label="Email"
        error
        helperText="Невірно вказана пошта"
        fullWidth
      />
      <TextField className={styles.field} label="Пароль" fullWidth />
      <MyButton>
        Увійти
      </MyButton>
    </Paper>
  );
};

export default Login;