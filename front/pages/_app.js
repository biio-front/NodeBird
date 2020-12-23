import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import withReduxSaga from 'next-redux-saga';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';

// pages의 공통인 부분. 예를들면 antd에서 가져오는 css는 다 공통.
const NodeBird = ({ Component }) => (
  <>
    <Head>
      <title>NodeBird</title>
    </Head>
    <AppLayout>
      <Component />
    </AppLayout>
  </>
);
NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(withReduxSaga(NodeBird));
