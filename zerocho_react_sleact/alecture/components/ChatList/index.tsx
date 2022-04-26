import React, { useCallback, useRef, VFC } from "react";

import {ChatZone, Section} from "@components/ChatList/styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";
import { Scrollbars } from "react-custom-scrollbars";

interface Props {
  chatData? : IDM[];
}

const ChatList : VFC<Props> = ({chatData}) => {
  const scrollRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => {
          return <Chat key={chat.id} data={chat} />
        })}
      </Scrollbars>
    </ChatZone>
  )
}

export default ChatList;