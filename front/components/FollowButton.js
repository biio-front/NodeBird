import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { followAction, unFollowAction } from '../reducers/user';

const FollowButton = ({ post }) => {
  const { currentUser, followLoading, unfollowLoading } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();
  const { id: userId } = post.User;
  const isFollowing = currentUser?.Followings?.find((v) => v.id === userId);
  const onFollow = useCallback(() => {
    dispatch(isFollowing ? unFollowAction(userId) : followAction(userId));
  }, [isFollowing]);
  return (
    <Button loading={followLoading || unfollowLoading} onClick={onFollow}>
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    User: PropTypes.shape({
      id: PropTypes.string,
      nickname: PropTypes.string,
    }),
    content: PropTypes.string,
    Comments: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          nickname: PropTypes.string,
        }),
        content: PropTypes.string,
      }),
    ),
    Images: PropTypes.arrayOf(PropTypes.object),
    createdAt: PropTypes.object,
  }).isRequired,
};

export default FollowButton;
