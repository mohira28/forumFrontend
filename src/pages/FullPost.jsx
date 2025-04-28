import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom'
import { Post } from "../components/Post";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { CommentsBlock } from "../components/CommentsBlok";
import { Index } from "../components/AddComment";

export const FullPost = () => {
  const [data, setData] = useState()
  const [comments, setComments] = useState()
  const [isLoading, setLoading] = useState(true)
  const {id} = useParams()
  
  const fetchComments = async () => {
    const res = await axios.get('/comments')    
    setComments(res.data.filter(el => el.post == id))
  }

  useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data)
      setLoading(false)
    }).catch(err => {
       console.log(err)
    })

    fetchComments()
  }, [])

  if(isLoading){
    return <Post isLoading={isLoading} isFullPost/>
  }

  const sendComment = (text) => {
    axios.post('/comments', 
      {
        text,
        postId: id
      }).catch(err => {
      console.log(err)
    })
    fetchComments()
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `${process.env.REACT_APP_BASE_URL}${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={false}
      >
        <Index handleSubmit={sendComment} />
      </CommentsBlock>
    </>
  );
};
