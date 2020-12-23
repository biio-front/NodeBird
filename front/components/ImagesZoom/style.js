import styled, { createGlobalStyle } from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

export const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
`;

export const CloseBtn = styled(CloseOutlined)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
  color: white;
  z-index: 5001;
`;

export const SlickWrapper = styled.div`
  height: 100vh;
  background: #090909cc;
`;

export const ImgWrapper = styled.div`
  padding: 30px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-width: 100%;
    max-height: 750px;
  }
`;

export const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    text-align: center;
    color: white;
    font-size: 15px;
    position: absolute;
    left: 50%;
    bottom: 44px;
    transform: translate(-50%, 0);
  }
`;

export const Global = createGlobalStyle`
  .slick-slide{
    display: inline-block;
  }

  .slick-arrow{
    width: 0;
    height: 0;
    opacity: 0;
  }

  /* antd 버그(position: fixed 사용하면 생기는 버그) 없애는 코드. 안써주면 가운데 화면안에 갇혀서 전체화면 안됨 */
  .ant-card-cover {
    transform: none !important;
  }

/* atnd 버그_ gutter 때문에 생기는 여백(스크롤 생김)*/
  .ant-row{
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }

  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;
