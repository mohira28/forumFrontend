import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../redux/slices/posts";
import { Post } from '../components/Post';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Button } from "@mui/material";
import { useNavigate} from "react-router-dom";


const style = {
    py: 0,
    width: '100%',
    maxWidth: 360,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
  };

export const UserPage = () => {
    const navigate = useNavigate()
    
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth.data)
    const {posts} = useSelector((state) => state.posts)

    const filteredPosts = () => {
        return posts.items.filter(el => el.user._id == userData._id) 
    }    
    useEffect(() => {
        dispatch(fetchPosts())
    }, [])

    
    return (
        <>
        <Grid container spacing={4}>
        <Grid xs={8} item>
          {!filteredPosts().length 
          ? <>
          <h1> У вас ещё нет постов </h1>  
          <Button
          variant="contained"
          onClick={() => navigate('../add-post')}
            > Добавить пост </Button>
          </>
          : filteredPosts().map((obj, index) =>  (
            <Post
              key={index}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl? `${process.env.REACT_APP_BASE_URL}${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
            />
          ))}
        </Grid>
        <Grid xs={4} item>
        <List sx={style}>
            <ListItem>
                <ListItemText primary={<strong> {userData.fullName} </strong>} disableTypography/>
            </ListItem>
            <Divider component="li" />
            <ListItem>
                <ListItemText primary={userData.email} />
            </ListItem>
            <Divider variant="li" component="li" />
            <ListItem>
                <ListItemText primary={`Количество постов: ${filteredPosts().length}`}  disableTypography/>
            </ListItem>
            <Divider variant="li" component="li" />
           
        </List>
        </Grid>
      </Grid>
        </>
    )
}