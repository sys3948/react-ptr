import React, { forwardRef, MutableRefObject, useCallback, useRef, VFC } from "react";

import {ChatZone, Section, StickyHeader} from "@components/ChatList/styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";
import { Scrollbars } from "react-custom-scrollbars";

interface Props {
  chatSections : {[key : string]:IDM[]};
  setSize : (f:(size : number) => number) => Promise<IDM[][] | undefined>;
  isEmpty : boolean;
  isReachingEnd : boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({chatSections, setSize, isEmpty, isReachingEnd}, ref) => {

  const onScroll = useCallback((values) => {
    console.log(values);
    if(values.scrollTop === 0 && !isReachingEnd){
      console.log('가장 위');
      setSize((prevSize) => prevSize + 1).then(() => {
        const current = (ref as MutableRefObject<Scrollbars>)?.current;
        if(current){
          current.scrollTop(current.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  }, [ref, isReachingEnd, setSize]);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`seciont-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => {
                return <Chat key={chat.id} data={chat} />
              })}
            </Section>
          )
        })}
      </Scrollbars>
    </ChatZone>
  )
});

export default ChatList;