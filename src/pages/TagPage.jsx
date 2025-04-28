import React, {useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux'
import { TagsBlock } from '../components/TagsBlock';
import {fetchPosts, fetchTags} from '../redux/slices/posts'
import { Post } from "../components/Post";

export const TagPage = () => {
  const {tagName} = useParams()
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth.data)
  const { posts, tags } = useSelector(state => state.posts)
  const isTagsLoading = tags.status === 'loading'

  useEffect(() => {
      dispatch(fetchPosts())
      dispatch(fetchTags())      
    }, [])

    const filteredPosts = posts.items.filter(el => el.tags.includes(tagName))
    
    
    return(
        <>
         <Grid container spacing={4}>
            <Grid xs={8} item>
              {filteredPosts.map((obj, index) => (
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
                <TagsBlock items={tags.items} isLoading={isTagsLoading} />
            </Grid>
      </Grid>
        </>
    )
}