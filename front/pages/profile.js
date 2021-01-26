import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import useSWR from 'swr';
import Axios from 'axios';
import { END } from 'redux-saga';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import wrapper from '../store/configureStore';
import { loadMyInfo } from '../reducers/user';

export const fetcher = (url) =>
  Axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError, mutate: followerMutate } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher,
  );
  const { data: followingsData, error: followingError, mutate: followingMutate } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher,
  );

  useEffect(() => !currentUser?.id && Router.push('/'), [currentUser?.id]);

  const loadMoreFollowings = useCallback(async () => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);
  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  useEffect(() => {
    followingMutate();
  }, [currentUser?.Followings]);

  useEffect(() => {
    followerMutate();
  }, [currentUser?.Followers]);

  if (!currentUser) return <div>로그인이 필요합니다.</div>;
  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  }
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <NicknameEditForm />
      <FollowList
        header="팔로잉 목록"
        data={followingsData}
        onClickMore={loadMoreFollowings}
        loading={!followingsData && !followingError}
      />
      <FollowList
        header="팔로워 목록"
        data={followersData}
        onClickMore={loadMoreFollowers}
        loading={!followersData && !followerError}
      />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req?.headers.cookie;
  Axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    Axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch(loadMyInfo()); // 로그인한 사용자 정보 불러오기
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default Profile;
