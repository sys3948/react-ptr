import React, { useCallback } from "react";
import gravatar from 'gravatar';
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";

import Workspace from "@layouts/Workspace";
import {Container, Header} from "@pages/DirectMessage/styles";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useinput";
import axios from "axios";

const DirectMessage = () => {
  const {workspace, dm} = useParams<{workspace:string; dm:string}>();
  const {data: userData} = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${dm}`, fetcher);
  const {data: myData} = useSWR('http://localhost:3095/api/users', fetcher);

  const [chat, onChangeChat, setChat] = useInput('');
  const {data : chatData, mutate : mutateChat} = useSWR(`http://localhost:3095/api/workspaces/${workspace}/dms/${dm}/chats?perPage=20&page=1`, fetcher);


  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('submit!');
    console.log('e의 내용은 : ', e);
    if(chat?.trim()){
      axios.post(`http://localhost:3095/api/workspaces/${workspace}/dms/${dm}/chats`, 
      {content : chat},
      {withCredentials : true},
      ).then(
        () => {
          mutateChat();
        }
      ).catch(console.error);
    }
    setChat('');
  }, [chat]);

  return (
    <Workspace>
      <Container>
        <Header>
          <img src={userData ? gravatar.url(userData.email, {s: '24px', d: 'retro'}) : ""} alt={userData ? userData.nickname : ""} />
          <span>{userData ? userData.nickname : "존재하지 않는 사용자입니다."}</span>
        </Header>
        <ChatList chatData={chatData} />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      </Container>
    </Workspace>
  );
};

export default DirectMessage;