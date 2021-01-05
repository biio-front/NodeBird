import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { loadPosts } from '../reducers/post';
import { loadMyInfo } from '../reducers/user';

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
    // 로그인한 사용자 정보 불러오기
    dispatch(loadMyInfo());
    // 처음 목록 불러오기
    dispatch(loadPosts());
  }, []);

  useEffect(() => {
    function onScroll() {
      const { scrollY } = window;
      const { clientHeight, scrollHeight } = document.documentElement;
      if (scrollY + clientHeight > scrollHeight - 300) {
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

export default Home;
