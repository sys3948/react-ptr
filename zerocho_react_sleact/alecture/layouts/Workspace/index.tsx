import { Header, RightMenu, ProfileImg, WorkspaceWrapper, Workspaces, Channels, Chats, WorkspaceName, MenuScroll, ProfileModal, LogOutButton, WorkspaceButton, AddButton, WorkspaceModal, } from '@layouts/Workspace/styles';

import fetcher from '@utils/fetcher';
import axios from 'axios';
import {IChannel, IUser} from '@typings/db';

import React, {FC, useCallback, useState} from "react";
import useSWR from 'swr';
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import gravatar from 'gravatar';

import loadable from '@loadable/component';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import { Link } from 'react-router-dom';
import { Button, Input, Label } from '@pages/Login/styles';
import useInput from '@hooks/useinput';
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace:FC = ({children}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkSpace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { workspace } = useParams< {workspace : string} >();

  const {data : userData, error, mutate} = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const {data:channelData} = useSWR<IChannel[]>(
    userData? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  console.log('채널 데이터는' + channelData);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials : true,
    }).then((response) => {
        mutate(false, false);
    });
  }, []);

  const onClickCreateWorkspace = useCallback((e) => {
    e.stopPropagation();
    setShowCreateWorkspaceModal((prev) => !prev);
  }, []);

  const onClickUserProfile = useCallback((e) => {
    // 토글 함수.
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const onCreateWorkspace = useCallback((e) => {
    e.preventDefault();
    if (!newWorkspace || !newWorkspace.trim()) return;
    if (!newUrl || !newUrl.trim()) return;
    axios.post('http://localhost:3095/api/workspaces', {
      workspace : newWorkspace,
      url : newUrl,
    },{
      withCredentials : true,
    }
    ).then((response) => {
      console.log(response);
      mutate();
      setShowCreateWorkspaceModal(false);
      setNewWorkSpace('');
      setNewUrl('');
    }).catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, { position : 'bottom-center' });
    });
  }, [newWorkspace, newUrl]);

  const toggleWorkspaceModal = useCallback((e) => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);


  if(!userData){
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
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, {s : '28px', d : 'retro'})} alt={userData.nickname}></ProfileImg>
            { showUserMenu && (<Menu style={{ right:0, top:38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src={gravatar.url(userData.email, {s : '36px', d : 'retro'})} alt={userData.nickname} />
                <div>
                  <span id='profile-name'>{userData.nickname}</span>
                  <span id='profile-active'>Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>)}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws) => {
          return (
            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
              <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
            </Link>
          );
        })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top : 95, left : 80 }}>
              <WorkspaceModal>
                <button onClick={onClickAddChannel}>채널 만들기</button>
              </WorkspaceModal>
            </Menu>
            {channelData?.map((v) => {
              return(
                <div key={v.id}>{v.name}</div>
              )
            })}
          </MenuScroll>
        </Channels>
        <Chats>
          {/* <Routes>
            <Route path="/channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes> */}
          {children}
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 URL</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type='submit'>생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal} />
    </div>
  );
}

export default Workspace;