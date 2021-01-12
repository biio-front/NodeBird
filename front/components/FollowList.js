import { Button, Card, List } from 'antd';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { removeFollowerAction, unFollowAction } from '../reducers/user';

const FollowList = ({ header, data, onClickMore, loading }) => {
  const dispatch = useDispatch();

  const onUnfollow = useCallback((id) => {
    if (header === '팔로잉 목록') {
      dispatch(unFollowAction(id));
    } else {
      dispatch(removeFollowerAction(id));
    }
  }, []);

  return (
    <List
      style={{ marginBottom: 20 }}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <Button onClick={onClickMore} loading={loading}>
            더보기
          </Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: 20 }}>
          <Card
            actions={[<StopOutlined key="stop" onClick={() => onUnfollow(item.id)} />]}
          >
            <Card.Meta description={item.nickname || item.id} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default FollowList;
