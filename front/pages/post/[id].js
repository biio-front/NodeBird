import React from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import Head from 'next/head';
import PostCard from '../../components/PostCard';
import { loadPost } from '../../reducers/post';
import { loadMyInfo } from '../../reducers/user';
import wrapper from '../../store/configureStore';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  return (
    <>
      <Head>
        <title>{singlePost.User.nickname}님의 글</title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : 'http://nodebird.com/favicon.ico'
          }
        />
        <meta property="og:title" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req?.headers.cookie;
  Axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    Axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch(loadMyInfo());
  context.store.dispatch(loadPost(context.params.id));
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default Post;
