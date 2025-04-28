import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from 'react-hook-form'
import styles from "./Login.module.scss";
import {fetchAuth, selectIsAuth} from '../../redux/slices/auth'
import { Navigate } from "react-router-dom";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: 'test@t.ru',
      password: '1234567888888'
    },
    mode: 'onChange'
  })
  const onSubmit = async (val) => {
    const data = await dispatch(fetchAuth(val))

    if(!data.payload){
      return alert('Не удалось авторизоваться!')
    }
    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token)
    } 
  }
  if(isAuth){
    console.log(selectIsAuth);
    return <Navigate to='/' />
  }


  return (
    <Paper elevation={1} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', {required: 'Укажите почту'})}
          fullWidth
        />
        <TextField 
          className={styles.field} 
          label="Пароль" 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type='password'
          {...register('password', {required: 'Укажите пароль'})}
          fullWidth 
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
