import Head from 'next/head';
import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Avatar } from 'antd';
import { END } from 'redux-saga';
import wrapper from '../store/configureStore';
import { loadUser } from '../reducers/user';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  if (!userInfo) return null;
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <Card
        actions={[
          <div key="twit">
            짹짹
            <br />
            {userInfo.Posts}
          </div>,
          <div key="followings">
            팔로잉
            <br />
            {userInfo.Followings}
          </div>,
          <div key="followers">
            팔로워
            <br />
            {userInfo.Followers}
          </div>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
          title={userInfo.nickname}
          description="노드버드 매니아"
        />
      </Card>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps(async (context) => {
  context.store.dispatch(loadUser(1));
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default About;
