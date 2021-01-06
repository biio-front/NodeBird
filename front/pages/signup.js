import { Button, Checkbox, Form, Input } from 'antd';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import Axios from 'axios';
import { END } from 'redux-saga';
import useInput from '../hooks/useInput';
import { loadMyInfo, signUpAction } from '../reducers/user';
import wrapper from '../store/configureStore';

const ErrorMessage = styled.div`
  color: red;
`;
const Signup = () => {
  const { signupLoading, signUpDone, signUpError, currentUser } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
    },
    [password],
  );

  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password === passwordCheck) {
      setPasswordError(false);
    } else if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    return dispatch(signUpAction({ email, password, nickname }));
  }, [email, password, passwordCheck, term]);

  useEffect(() => currentUser?.id && Router.replace('/'), [currentUser?.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  return (
    <>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <Input
            name="user-email"
            type="email"
            value={email}
            required
            onChange={onChangeEmail}
          />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <Input
            name="user-nickname"
            type="nickname"
            value={nickname}
            required
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <Input
            name="user-password"
            type="password"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-passwordCheck">비밀번호 체크</label>
          <Input
            name="user-passwordCheck"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            회원가입에 동의합니다.
          </Checkbox>
          {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signupLoading}>
            가입하기
          </Button>
        </div>
      </Form>
    </>
  );
};

// 화면을 그리기 전 서버쪽에서 먼저 실행
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req?.headers.cookie;
  Axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    Axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch(loadMyInfo());
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default Signup;
