import Axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import PostCard from '../../components/PostCard';
import { loadHashtagPosts } from '../../reducers/post';
import { loadMyInfo } from '../../reducers/user';
import wrapper from '../../store/configureStore';

const Hashtag = () => {
  const router = useRouter();
  const { tag } = router.query;
  const dispatch = useDispatch();
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post,
  );

  useEffect(() => {
    function onScroll() {
      const { pageYOffset } = window;
      const { clientHeight, scrollHeight } = document.documentElement;
      if (pageYOffset + clientHeight > scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch(loadHashtagPosts(tag, lastId));
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, tag, mainPosts, loadPostsLoading]);

  return (
    <>
      <Head>
        <title>NodeBird | {tag}</title>
        <meta name="description" content={tag} />
        <meta property="og:title" content={tag} />
        <meta property="og:description" content={tag} />
        <meta property="og:image" content="https://nodebird.com/favicon.ico" />
        <meta property="og:title" content={`https://nodebird.com/post/${tag}`} />
      </Head>
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {loadPostsLoading ? <div>Loading...</div> : null}
    </>
  );
};

// 화면을 그리기 전 서버쪽에서 먼저 실행
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');

  const cookie = context.req?.headers.cookie;
  Axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    Axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch(loadMyInfo()); // 로그인한 사용자 정보 불러오기
  context.store.dispatch(loadHashtagPosts(context.params.tag)); // 목록 불러오기
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  // return { props: {} };
});

export default Hashtag;
