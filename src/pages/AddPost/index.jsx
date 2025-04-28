import React, {useRef, useState, useCallback, useEffect, useMemo} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import axios from '../../axios';

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImage] = useState('');
  const inputFileRef = useRef(null)

  const isEditing = Boolean(id)

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData()
      formData.append('image', e.target.files[0])
      const {data} = await axios.post('/upload', formData)
      setImage(data.url)
    } catch (error) {
      console.warn(error)
    }
  };

  const onClickRemoveImage = (event) => {
    setImage('')
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        text, 
        imageUrl, 
        tags,  
      }

      const { data } = isEditing 
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)

      const _id = data._id
      
      navigate(`../posts/${_id}`)
    } catch (error) {
      console.warn(error)
    }
  }

  useEffect(() => {
    if(id){
      axios.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title)
        setText(data.text)
        setImage(data.imageUrl)
        setTags(data.tags.join(','))
      })
    }
  }, [])

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if(!localStorage.getItem('token')){
    return <Navigate to='/' />
  }

  return (
    <Paper elevation={1} style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input 
        ref={inputFileRef} 
        type="file" 
        onChange={handleChangeFile}
        hidden 
      />
      {imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
        <img className={styles.image} src={`${process.env.REACT_APP_BASE_URL}${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        classes={{ root: styles.tags }} 
        onChange={e => setTags(e.target.value)}
        variant="standard" 
        placeholder="Тэги" 
        value={tags}
        fullWidth 
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
