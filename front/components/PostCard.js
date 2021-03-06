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
import Link from 'next/link';
import moment from 'moment';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { likePost, removePost, retweet, unlikePost } from '../reducers/post';
import FollowButton from './FollowButton';

moment.locale('ko');

const PostCard = ({ post }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { removePostLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const id = currentUser?.id;
  const [commentFormOpen, setCommentFormOpen] = useState(false);
  const liked = post.Likers.find((v) => v === id);
  const postId = post.id;

  const onToggleLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch(liked ? unlikePost(postId) : likePost(postId));
  }, [liked, id]);
  const onToggleComment = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return setCommentFormOpen((prev) => !prev);
  }, [id]);
  const onDeletePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch(removePost(postId));
  }, [id]);
  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch(retweet(postId));
  }, [id]);

  return (
    <div>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
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
        title={post.Retwee ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && post.User.id !== id && <FollowButton post={post} />}
      >
        {post.Retwee ? (
          <Card
            cover={post.Retwee.Images[0] && <PostImages images={post.Retwee.Images} />}
          >
            <div style={{ float: 'right' }}>
              {moment(post.createdAt).format('YYYY.MM.DD')}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retwee.User.id}`}>
                  <a>
                    <Avatar>{post.Retwee.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retwee.User.nickname}
              description={<PostCardContent postData={post.Retwee.content} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>{moment(post.createdAt).fromNow()}</div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>
        )}
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
                  avatar={
                    <Link href={`/user/${post.User.id}`}>
                      <a>
                        <Avatar>{post.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
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
    Likers: PropTypes.array,
    createdAt: PropTypes.string,
    Retwee: PropTypes.shape({
      id: PropTypes.number,
      User: PropTypes.shape({
        id: PropTypes.number,
        nickname: PropTypes.string,
      }),
      content: PropTypes.string,
      Images: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
};

export default PostCard;
