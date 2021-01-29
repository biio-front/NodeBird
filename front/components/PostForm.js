import { Button, Form, Input } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { addPost, removeImage, uploadImages } from '../reducers/post';

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const [text, onChangeText, setText] = useInput('');
  const dispatch = useDispatch();
  const imageInput = useRef();

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  // 서브밋에 set텍스트가있으면, 서버쪽에서 오류났을때 포스팅은안됐는데 자료가 다 없어짐 ㅠㅠ
  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }

    const formData = new FormData(); // multer 배우는 입장에서 formdata를 써보는거임.
    // json 형태로 보내도됨. image 가 없으면 form으로 하는건 매우 비효율적...^^
    imagePaths.forEach((v) => {
      formData.append('image', v);
    });
    formData.append('content', text);
    return dispatch(addPost(formData));
  }, [text, imagePaths]);

  const onChangeImages = useCallback((e) => {
    const { files } = e.target;
    const imageFormData = new FormData();
    [].forEach.call(files, (file) => {
      imageFormData.append('image', file);
    });
    dispatch(uploadImages(imageFormData));
  }, []);

  const onRemoveImage = useCallback((index) => {
    dispatch(removeImage(index));
  });

  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="무슨 일이 있었나요?"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
          key={imagePaths} // 기존파일이랑 같은경우 onChange가 실행안됨. 강제 리렌더링시켜줌.
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => {
          return (
            <div key={v} style={{ display: 'inline-block' }}>
              {/* <img src={`${backUrl}/${v}`} style={{ width: '200px' }} alt={v} /> */}
              <img src={v} style={{ width: '200px' }} alt={v} />
              <div>
                <Button onClick={() => onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default PostForm;
