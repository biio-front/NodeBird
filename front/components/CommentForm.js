import { Button, Form, Input } from 'antd';
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { addComment } from '../reducers/post';

const CommentForm = ({ postId }) => {
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [commentText, onChangeCommentText, setcommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setcommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    const data = {
      comment: commentText,
      postId,
    };
    dispatch(addComment(data));
  }, [commentText]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button type="primary" htmlType="submit" loading={addCommentLoading}>
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  postId: PropTypes.number.isRequired,
};
export default CommentForm;
