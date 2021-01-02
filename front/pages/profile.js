import Head from 'next/head';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { loadFollowersAction, loadFollowingsAction } from '../reducers/user';

const profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => !currentUser?.id && Router.push('/'), [currentUser?.id]);
  useEffect(() => {
    dispatch(loadFollowersAction());
    dispatch(loadFollowingsAction());
  }, []);

  if (!currentUser) return null;
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <NicknameEditForm />
      <FollowList header="팔로잉 목록" data={currentUser.Followings} />
      <FollowList header="팔로워 목록" data={currentUser.Followers} />
    </>
  );
};

export default profile;
