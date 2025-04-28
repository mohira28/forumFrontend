import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from "react-redux";
import styles from './Login.module.scss';
import {fetchRegister, selectIsAuth} from '../../redux/slices/auth'
import {useForm} from 'react-hook-form'
import { Navigate } from 'react-router-dom';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: 'Мохира Абдукаримова',
      email: 'test@t.ru',
      password: '1234567888888'
    },
    mode: 'onChange'
  })

  const onSubmit = async (val) => {
    const data = await dispatch(fetchRegister(val))
    if(!data.payload){
      return alert('Не удалось зарегистрироваться!')
    }
    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token)
    } 
  }
  if(isAuth){
    return <Navigate to='/' />
  }

  return (
    <Paper elevation={1}  classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form>
        <TextField  
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          type="text"
          {...register('fullName', {required: 'Укажите полное имя'})}
          className={styles.field} 
          label="Полное имя" 
          fullWidth 
        />
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
          type="password"
          {...register('password', {required: 'Укажите пароль'})}
          fullWidth 
        />
      </form>
      <Button  disabled={!isValid} onClick={handleSubmit(onSubmit)} size="large" variant="contained" fullWidth>
        Зарегистрироваться
      </Button>
    </Paper>
  );
};
