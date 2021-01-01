import { Button, Card, Comment, List, Popover } from 'antd';
import {
  EllipsisOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import ButtonGroup from 'antd/lib/button/button-group';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'antd/lib/avatar/avatar';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { removePost } from '../reducers/post';
import FollowButton from './FollowButton';

const PostCard = ({ post }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { removePostLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const id = currentUser?.id;
  const [liked, setLiked] = useState(false);
  const [commentFormOpen, setCommentFormOpen] = useState(false);

  const onToggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);
  const onToggleComment = useCallback(() => {
    setCommentFormOpen((prev) => !prev);
  }, []);
  const onDeletePost = useCallback(() => {
    const { id: postId } = post;
    dispatch(removePost(postId));
  }, []);

  return (
    <div>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onToggleLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <ButtonGroup>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button
                      type="danger"
                      onClick={onDeletePost}
                      loading={removePostLoading}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </ButtonGroup>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpen && (
        <>
          <CommentForm postId={post.id} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </div>
  );
};
PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.shape({
      id: PropTypes.number,
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
    createdAt: PropTypes.string,
  }).isRequired,
};

export default PostCard;
