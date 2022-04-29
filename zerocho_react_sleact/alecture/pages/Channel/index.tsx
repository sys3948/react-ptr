import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useinput";
import useSocket from "@hooks/useSocket";
import Workspace from "@layouts/Workspace";
import { Container, Header } from "@pages/Channel/styles";
import makeSection from "@utils/makeSection";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import fetcher from "@utils/fetcher";
import { IChannel, IChat, IUser } from "@typings/db";
import InviteChannelModal from "@components/InviteChannelModal";

const Channel = () => {
  const {workspace, channel} = useParams<{workspace:string; channel:string}>();
  const {data: myData} = useSWR('http://localhost:3095/api/users', fetcher);

  const [chat, onChangeChat, setChat] = useInput('');
  const {data : channelData} = useSWR<IChannel>(`http://localhost:3095/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const {data : chatData, mutate : mutateChat, setSize} = useSWRInfinite<IChat[]>((index) => `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`, fetcher);
  const {data : channelMembersData} = useSWR<IUser[]>(myData ? `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members` : null, fetcher);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);

  const [socket] = useSocket(workspace);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);


  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('submit!');
    console.log('e의 내용은 : ', e);
    if(chat?.trim() && chatData && channelData){
      mutateChat((prevChatData) => {
        prevChatData?.[0].unshift({
          id : (chatData[0][0]?.id || 0) + 1,
          content : chat,
          UserId : myData.id,
          User : myData,
          ChannelId : channelData.id,
          Channel : channelData,
          createdAt : new Date(),
        });

        return prevChatData;
      }).then(() => {
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      });

      axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/chats`, 
      {content : chat},
      {withCredentials : true},
      ).then(
        () => {
          mutateChat();
        }
      ).catch(console.error);
    }
  }, [chat, chatData, myData, channelData, workspace, channel]);

  const onMessage = useCallback((data : IChat) => {
    if(data.Channel.name === channel && myData?.id !== data.UserId){
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

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, [])

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    }
  }, [socket, onMessage]);

  useEffect(() => {
    if(chatData?.length === 1){
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  if(!myData || !myData){
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);
  
  return (
    <Workspace>
      <Container>
        <Header>
          <span>#{channel}</span>
          <div className="header-right">
            <span>{channelMembersData?.length}</span>
            <button 
             onClick={onClickInviteChannel}
             className="c-button-unstyled p-ia__view_header__button"
             aria-label="Add people to #react-native"
             data-sk="tooltip_parent"
             type="button">
              <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
            </button>
          </div>
        </Header>
        <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd} />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
        <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal} />
      </Container>
    </Workspace>
  );
}

export default Channel;

