import { Header, RightMenu, ProfileImg, WorkspaceWrapper, Workspaces, Channels, Chats, WorkspaceName, MenuScroll } from '@layouts/Workspace/styles';

import fetcher from '@utils/fetcher';
import axios from 'axios';

import React, {FC, useCallback} from "react";
import useSWR from 'swr';
import {Routes, Route, Navigate} from 'react-router-dom';
import gravatar from 'gravatar';

const Workspace:FC = ({children}) => {
  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials : true,
    }).then((response) => {
        mutate(false, false);
    });
  }, []);

  if(!data){
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return(
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, {s : '28px', d : 'retro'})} alt={data.ninckname}></ProfileImg>
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그 아웃</button>
      <WorkspaceWrapper>
        <Workspaces></Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>Menu Scroll</MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
}

export default Workspace;