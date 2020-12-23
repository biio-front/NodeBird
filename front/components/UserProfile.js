import { Button, Card } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOutAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, logOutLoading } = useSelector((state) => state.user);
  const onLogOut = useCallback(() => dispatch(logOutAction()), []);
  return (
    <>
      <Card
        actions={[
          <div key="twit">
            짹짹
            <br />
            {currentUser.Posts.length}
          </div>,
          <div key="followings">
            필로잉
            <br />
            {currentUser.Followings.length}
          </div>,
          <div key="follower">
            팔로워
            <br />
            {currentUser.Followers.length}
          </div>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{currentUser.nickname[0]}</Avatar>}
          title={currentUser.nickname}
        />
        <Button onClick={onLogOut} loading={logOutLoading}>
          로그아웃
        </Button>
      </Card>
    </>
  );
};

export default UserProfile;
