import React, { useEffect, useState } from 'react'
import { query, collection, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import Post from './Post'

const Posts = () => {
  const [posts, setPosts] = useState([])
  console.log(posts[0])

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          setPosts(snapshot.docs)
        }
      ),
    [db]
  )
  return (
    <div className="">
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            id={post.id}
            username={post.data().username}
            userImg={post.data().profileImg}
            img={post.data().image}
            caption={post.data().caption}
          />
        )
      })}
    </div>
  )
}

export default Posts
