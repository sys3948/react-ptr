import React, { useState, useCallback }  from "react";

import useInput from '@hooks/useinput';
import fetcher from '@utils/fetcher';

import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from './styles';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import axios from "axios";

const SignUP = () => {

  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    console.log(email, nickname, password, passwordCheck);

    if(!mismatchError && nickname){
      console.log('서버로 회원 가입하기!');
      // 비동기 요청하기 전에 then, catch, finally에 해당되는 state를 초기화 하는게 좋다.
      // loading 단계
      setSignUpError('');
      setSignUpSuccess(false);
      axios.post('http://localhost:3095/api/users', {
        email,
        nickname,
        password
      }).then(
        // 성공
        (response) => {
          console.log(response);
          setSignUpSuccess(true);
        }
      ).catch(
        // 실패
        (error) => {
          console.log(error.response);
          setSignUpError(error.response.data);
        }
      ).finally(
        // 공통적인 부분.
        () => {}
      );
    }else{
      console.log('비밀번호가 일치하지 않습니다!');
    }
  }, [email, nickname, password, passwordCheck]);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
    setMismatchError(e.target.value !== passwordCheck);
  }, [passwordCheck]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setMismatchError(e.target.value !== password);
  }, [password]);

  if(data === undefined){
    return (
      <div>로딩중...</div>
    );
  }

  if(data){
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/workspace/channel" />} />
      </Routes>
    )
  }

  return (
     <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
}

export default SignUP;