import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux'
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import {fetchPosts, fetchTags} from '../redux/slices/posts'

export const Home = () => {
  const dispatch = useDispatch()
  const { posts, tags } = useSelector(state => state.posts)
  const userData = useSelector((state) => state.auth.data)
  const [isPostsLoading, setIsPostsLoading]= useState(true)
  const isTagsLoading = tags.status === 'loading'
  const [sortedPosts, setSortedPosts] = useState()
  const [tabValue, setTabValue] = useState(0)

  const selectedSort = (sort) => {
    const sortByViews = Object.values(posts.items).sort(function(a, b) {
      return b.viewsCount - a.viewsCount;
    });
      switch (sort) {
        case "Новые":
          setSortedPosts(posts.items)
          setTabValue(0)
          break;
        case "Популярные":
          setSortedPosts(sortByViews)
          setTabValue(1)
          break;  
        default:
          setSortedPosts(posts.items)
          break;
      }
  }

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
  }, [])

  useEffect(() => {
    setSortedPosts(posts.items)
    setIsPostsLoading(false)
  }, [posts])
  
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={tabValue} aria-label="basic tabs example">
        <Tab label="Новые" onClick={() => selectedSort("Новые")}/>
        <Tab label="Популярные" onClick={() => selectedSort("Популярные")}/>
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading? [...Array(5)] : sortedPosts).map((obj, index) => isPostsLoading ? (
            <Post key={index} isLoading={true}/>
          ) : (
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
  );
};
