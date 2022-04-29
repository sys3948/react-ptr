import React, { useCallback, useEffect, useRef } from "react";
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
import useSocket from "@hooks/useSocket";

const DirectMessage = () => {
  const {workspace, dm} = useParams<{workspace:string; dm:string}>();
  const {data: userData} = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${dm}`, fetcher);
  const {data: myData} = useSWR('http://localhost:3095/api/users', fetcher);

  const [chat, onChangeChat, setChat] = useInput('');
  const {data : chatData, mutate : mutateChat, setSize} = useSWRInfinite<IDM[]>((index) => `http://localhost:3095/api/workspaces/${workspace}/dms/${dm}/chats?perPage=20&page=${index + 1}`, fetcher);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);

  const [socket] = useSocket(workspace);


  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('submit!');
    console.log('e의 내용은 : ', e);
    if(chat?.trim() && chatData){
      mutateChat((prevChatData) => {
        prevChatData?.[0].unshift({
          id : (chatData[0][0]?.id || 0) + 1,
          content : chat,
          SenderId : myData.id,
          Sender : myData,
          ReceiverId : userData.id,
          Receiver : userData,
          createdAt : new Date(),
        });

        return prevChatData;
      }).then(() => {
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      });

      axios.post(`http://localhost:3095/api/workspaces/${workspace}/dms/${dm}/chats`, 
      {content : chat},
      {withCredentials : true},
      ).then(
        () => {
          mutateChat();
        }
      ).catch(console.error);
    }
  }, [chat]);

  const onMessage = useCallback((data : IDM) => {
    console.log('onMessage의 myData는 ', myData);
    if(data.SenderId === Number(dm) && myData?.id !== Number(dm)){
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if(scrollbarRef.current){
          if(scrollbarRef.current.getScrollHeight() < scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150){
            scrollbarRef.current?.scrollToBottom();
          }
        }
      })
    }
  }, []);

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    }
  }, [socket, onMessage]);

  useEffect(() => {
    if(chatData?.length === 1){
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

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