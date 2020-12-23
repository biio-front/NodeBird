import produce from 'immer';

export const initialState = {
  loginLoading: false, // 로그인 시도 중
  isLoggedIn: false,
  loginError: null,
  logOutLoading: false, // 로그아웃 시도 중
  logOutError: null,
  signupLoading: false, // 회원가입 시도 중
  signupDone: false,
  signupError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도 중
  changeNicknameDone: false,
  changeNicknameError: null,
  followLoading: false, // 팔로우 시도 중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도 중
  unfollowDone: false,
  unfollowError: null,
  currentUser: null,
  signUpData: {},
  loginData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_REQUEST';
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';
export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';
export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

const dummyUser = (data) => ({
  ...data,
  nickname: '비오',
  id: 'a2',
  Posts: [],
  Followings: [{ nickname: '제로초' }, { nickname: '정어리' }],
  Followers: [{ nickname: '제로초' }, { nickname: '정어리' }],
});

export const loginAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  };
};
export const logOutAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  };
};
export const signUpAction = (data) => {
  return {
    type: SIGN_UP_REQUEST,
    data,
  };
};
export const followAction = (data) => {
  return {
    type: FOLLOW_REQUEST,
    data,
  };
};
export const unFollowAction = (data) => {
  return {
    type: UNFOLLOW_REQUEST,
    data,
  };
};

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_REQUEST: {
        draft.loginLoading = true;
        draft.loginError = null;
        break;
      }
      case LOG_IN_SUCCESS: {
        draft.loginLoading = false;
        draft.isLoggedIn = true;
        draft.currentUser = dummyUser(action.data);
        break;
      }
      case LOG_IN_FAILURE: {
        draft.isLoggedIn = false;
        draft.loginError = action.error;
        break;
      }
      case LOG_OUT_REQUEST: {
        draft.logOutLoading = true;
        draft.logOutError = null;
        break;
      }
      case LOG_OUT_SUCCESS: {
        draft.isLoggedIn = false;
        draft.logOutLoading = false;
        draft.currentUser = null;
        break;
      }
      case LOG_OUT_FAILURE: {
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      }
      case SIGN_UP_REQUEST: {
        draft.signUpLoading = true;
        draft.signupDone = false;
        draft.signUpError = null;
        break;
      }
      case SIGN_UP_SUCCESS: {
        draft.signupDone = true;
        draft.signUpLoading = false;
        break;
      }
      case SIGN_UP_FAILURE: {
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;
      }
      case CHANGE_NICKNAME_REQUEST: {
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      }
      case CHANGE_NICKNAME_SUCCESS: {
        draft.changeNicknameDone = true;
        draft.changeNicknameLoading = false;
        break;
      }
      case CHANGE_NICKNAME_FAILURE: {
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      }
      case ADD_POST_TO_ME: {
        draft.currentUser.Posts.unshift({ id: action.data });
        break;
      }
      case REMOVE_POST_OF_ME: {
        draft.currentUser.Posts = draft.currentUser.Posts.filter(
          (post) => post.id !== action.data,
        );
        break;
      }
      case FOLLOW_REQUEST: {
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
        break;
      }
      case FOLLOW_SUCCESS: {
        draft.followDone = true;
        draft.followLoading = false;
        draft.currentUser.Followings = draft.currentUser.Followings.concat({
          id: action.data,
        });
        break;
      }
      case FOLLOW_FAILURE: {
        draft.followLoading = false;
        draft.followError = action.error;
        break;
      }
      case UNFOLLOW_REQUEST: {
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        break;
      }
      case UNFOLLOW_SUCCESS: {
        console.log(action.data);
        draft.unfollowDone = true;
        draft.unfollowLoading = false;
        draft.currentUser.Followings = draft.currentUser.Followings.filter(
          (v) => v.id !== action.data,
        );
        break;
      }
      case UNFOLLOW_FAILURE: {
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
      }
      default:
        break;
    }
  });
};
export default reducer;
