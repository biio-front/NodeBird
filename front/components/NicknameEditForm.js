import { Input } from 'antd';
import Form from 'antd/lib/form/Form';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { changeNicknameAction } from '../reducers/user';

const NicknameEditForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [nickname, onChange] = useInput(currentUser.nickname || '');

  const onSubmit = useCallback(() => {
    dispatch(changeNicknameAction(nickname));
  }, [nickname]);

  const style = useMemo(
    () => ({
      marginBottom: '20px',
      border: '1px solid #d9d9d9',
      padding: '20px',
    }),
    [],
  );

  return (
    <Form style={style}>
      <Input.Search
        addonBefore="닉네임"
        enterButton="수정"
        value={nickname}
        onChange={onChange}
        onSearch={onSubmit}
      />
    </Form>
  );
};

export default NicknameEditForm;
