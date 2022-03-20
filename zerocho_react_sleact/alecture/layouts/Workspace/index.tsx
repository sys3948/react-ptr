import { Header, RightMenu, ProfileImg, WorkspaceWrapper, Workspaces, Channels, Chats, WorkspaceName, MenuScroll, ProfileModal, LogOutButton } from '@layouts/Workspace/styles';

import fetcher from '@utils/fetcher';
import axios from 'axios';

import React, {FC, useCallback, useState} from "react";
import useSWR from 'swr';
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import gravatar from 'gravatar';

import loadable from '@loadable/component';
import Menu from '@components/Menu';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace:FC = ({children}) => {
  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials : true,
    }).then((response) => {
        mutate(false, false);
    });
  }, []);

  const onClickUserProfile = useCallback(() => {
    // 토글 함수.
    setShowUserMenu((prev) => !prev);
  }, []);

  if(!data){
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  console.log('Workspace 입니다.');
  console.log(data);

  return(
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(data.email, {s : '28px', d : 'retro'})} alt={data.nickname}></ProfileImg>
            { showUserMenu && (<Menu style={{ right:0, top:38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src={gravatar.url(data.email, {s : '36px', d : 'retro'})} alt={data.nickname} />
                <div>
                  <span id='profile-name'>{data.nickname}</span>
                  <span id='profile-active'>Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>)}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces></Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>Menu Scroll</MenuScroll>
        </Channels>
        <Chats>
          {/* <Routes>
            <Route path="/channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes> */}
          {children}
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
}

export default Workspace;