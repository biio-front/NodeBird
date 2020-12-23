import shortid from 'shortid';
import produce from 'immer';
import faker from 'faker';

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false, // 포스트 불러오는 중
  addPostDone: false,
  addPostError: null,
  removePostLoading: false, // 포스트 삭제 중
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false, // 댓글 불러오는 중
  addCommentDone: false,
  addCommentError: null,
};

export const generateDummyPost = (number) =>
  Array(number)
    .fill()
    .map(() => ({
      id: shortid.generate(),
      User: {
        id: shortid.generate(),
        nickname: faker.name.findName(),
      },
      Images: [
        {
          id: shortid.generate(),
          src: faker.image.image(),
        },
      ],
      content: faker.lorem.paragraph(),
      Comments: [
        {
          User: {
            id: shortid.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }));

const dummyPost = (data) => ({
  id: data.id,
  User: {
    id: 'a2',
    nickname: '비오',
  },
  Images: [],
  content: data.content,
  Comments: [],
});

const dummyComment = (data) => ({
  User: {
    id: data.userId,
    nickname: '비오',
  },
  content: data.comment,
});

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';
export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';
export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const loadPosts = () => ({
  type: LOAD_POSTS_REQUEST,
});

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const removePost = (data) => ({
  type: REMOVE_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POSTS_REQUEST: {
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      }
      case LOAD_POSTS_SUCCESS: {
        draft.mainPosts.push(...action.data);
        draft.hasMorePosts = draft.mainPosts.length < 50;
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        break;
      }
      case LOAD_POSTS_FAILURE: {
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      }
      case ADD_POST_REQUEST: {
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      }
      case ADD_POST_SUCCESS: {
        draft.mainPosts.unshift(dummyPost(action.data));
        draft.addPostLoading = false;
        draft.addPostDone = true;
        break;
      }
      case ADD_POST_FAILURE: {
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      }
      case REMOVE_POST_REQUEST: {
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      }
      case REMOVE_POST_SUCCESS: {
        draft.mainPosts = draft.mainPosts.filter((post) => post.id !== action.data);
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      }
      case REMOVE_POST_FAILURE: {
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      }
      case ADD_COMMENT_REQUEST: {
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      }
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        post.Comments.unshift(dummyComment(action.data));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
      case ADD_COMMENT_FAILURE: {
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      }
      default:
        break;
    }
  });
};
export default reducer;
