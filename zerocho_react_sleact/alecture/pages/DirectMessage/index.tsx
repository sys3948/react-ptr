import React, { useCallback, useRef } from "react";
import gravatar from 'gravatar';
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";

import Workspace from "@layouts/Workspace";
import {Container, Header} from "@pages/DirectMessage/styles";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useinput";
import axios from "axios";
import makeSection from "@utils/makeSection";
import { IDM } from "@typings/db";
import Scrollbars from "react-custom-scrollbars";

const DirectMessage = () => {
  const {workspace, dm} = useParams<{workspace:string; dm:string}>();
  const {data: userData} = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${dm}`, fetcher);
  const {data: myData} = useSWR('http://localhost:3095/api/users', fetcher);

  const [chat, onChangeChat, setChat] = useInput('');
  const {data : chatData, mutate : mutateChat, setSize} = useSWRInfinite<IDM[]>((index) => `http://localhost:3095/api/workspaces/${workspace}/dms/${dm}/chats?perPage=20&page=${index + 1}`, fetcher);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);


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

  if(!userData || !myData){
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Workspace>
      <Container>
        <Header>
          <img src={userData ? gravatar.url(userData.email, {s: '24px', d: 'retro'}) : ""} alt={userData ? userData.nickname : ""} />
          <span>{userData ? userData.nickname : "존재하지 않는 사용자입니다."}</span>
        </Header>
        <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd} />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      </Container>
    </Workspace>
  );
};

export default DirectMessage;