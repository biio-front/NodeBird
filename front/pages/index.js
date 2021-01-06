import Axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { loadPosts } from '../reducers/post';
import { loadMyInfo } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector(
    (state) => state.post,
  );

  useEffect(() => {
    retweetError && alert(retweetError);
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      const { pageYOffset } = window;
      const { clientHeight, scrollHeight } = document.documentElement;
      if (pageYOffset + clientHeight > scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch(loadPosts(lastId));
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <>
      {/* 로그인한 사람만 게시글 적는게 보임 */}
      {isLoggedIn && <PostForm />}
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
  context.store.dispatch(loadPosts()); // 처음 목록 불러오기
  // 요청만하고 응답은 못받은채 실행됨. 리퀘스트에서 그냥 프론트로 돌아옴.
  // 서버사이드에서 리퀘스트가 서써스로 바뀔때가지 기다려주는게 필요.
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
