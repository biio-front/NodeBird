import produce from 'immer';

export const initialState = {
  loginLoading: false, // 로그인 시도 중
  isLoggedIn: false,
  loginError: null,
  logOutLoading: false, // 로그아웃 시도 중
  logOutError: null,
  signUpLoading: false, // 회원가입 시도 중
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도 중
  changeNicknameDone: false,
  changeNicknameError: null,
  followLoading: false, // 팔로우 시도 중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도 중
  unfollowDone: false,
  unfollowError: null,
  removeFollowererLoading: false, // 팔로우 삭제 시도 중
  removeFollowererDone: false,
  removeFollowererError: null,
  loadFollowersLoading: false, // 팔로워 가져오기 시도 중
  loadFollowersDone: false,
  loadFollowersError: null,
  loadFollowingsLoading: false, // 팔로잉 가져오기 시도 중
  loadFollowingsDone: false,
  loadFollowingsError: null,
  currentUser: null,
  signUpData: {},
  loginData: {},
};
export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
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
export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';
export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';
export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

export const loadMyInfo = () => {
  return { type: LOAD_MY_INFO_REQUEST };
};
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
export const removeFollowerAction = (data) => ({
  type: REMOVE_FOLLOWER_REQUEST,
  data,
});
export const changeNicknameAction = (data) => ({
  type: CHANGE_NICKNAME_REQUEST,
  data,
});
export const loadFollowersAction = () => ({ type: LOAD_FOLLOWERS_REQUEST });
export const loadFollowingsAction = () => ({ type: LOAD_FOLLOWINGS_REQUEST });

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_MY_INFO_REQUEST: {
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoError = null;
        break;
      }
      case LOAD_MY_INFO_SUCCESS: {
        draft.loadMyInfoLoading = false;
        draft.isLoggedIn = true;
        draft.currentUser = action.data;
        break;
      }
      case LOAD_MY_INFO_FAILURE: {
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoError = action.error;
        break;
      }
      case LOG_IN_REQUEST: {
        draft.loginLoading = true;
        draft.loginError = null;
        break;
      }
      case LOG_IN_SUCCESS: {
        draft.loginLoading = false;
        draft.isLoggedIn = true;
        draft.currentUser = action.data;
        break;
      }
      case LOG_IN_FAILURE: {
        draft.loginLoading = false;
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
        draft.signUpDone = false;
        draft.signUpError = null;
        break;
      }
      case SIGN_UP_SUCCESS: {
        draft.signUpDone = true;
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
        draft.currentUser.nickname = action.data;
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
        draft.currentUser.Followings.push({ id: action.data.UserId });
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
        draft.unfollowDone = true;
        draft.unfollowLoading = false;
        draft.currentUser.Followings = draft.currentUser.Followings.filter(
          (v) => v.id !== action.data.UserId,
        );
        break;
      }
      case UNFOLLOW_FAILURE: {
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
      }
      case REMOVE_FOLLOWER_REQUEST: {
        draft.removeFollowererLoading = true;
        draft.removeFollowererDone = false;
        draft.removeFollowererError = null;
        break;
      }
      case REMOVE_FOLLOWER_SUCCESS: {
        draft.removeFollowererDone = true;
        draft.removeFollowererLoading = false;
        console.log(action.data.UserId);
        draft.currentUser.Followers = draft.currentUser.Followers.filter(
          (v) => v.id !== action.data.UserId,
        );
        break;
      }
      case REMOVE_FOLLOWER_FAILURE: {
        draft.removeFollowererLoading = false;
        draft.removeFollowererError = action.error;
        break;
      }
      case LOAD_FOLLOWERS_REQUEST: {
        draft.loadFollowersLoading = true;
        draft.loadFollowersDone = false;
        draft.loadFollowersError = null;
        break;
      }
      case LOAD_FOLLOWERS_SUCCESS: {
        draft.loadFollowersDone = true;
        draft.loadFollowersLoading = false;
        draft.currentUser.Followers = action.data.followers;
        break;
      }
      case LOAD_FOLLOWERS_FAILURE: {
        draft.loadFollowersLoading = false;
        draft.loadFollowersError = action.error;
        break;
      }
      case LOAD_FOLLOWINGS_REQUEST: {
        draft.loadFollowingsLoading = true;
        draft.loadFollowingsDone = false;
        draft.loadFollowingsError = null;
        break;
      }
      case LOAD_FOLLOWINGS_SUCCESS: {
        draft.loadFollowingsDone = true;
        draft.loadFollowingsLoading = false;
        draft.currentUser.Followings = action.data.followings;
        break;
      }
      case LOAD_FOLLOWINGS_FAILURE: {
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsError = action.error;
        break;
      }
      default:
        break;
    }
  });
};
export default reducer;
