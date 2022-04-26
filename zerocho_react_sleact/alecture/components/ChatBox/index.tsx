import React, { useCallback, useEffect, useRef, VFC } from "react";
import autosize from "autosize";
import { Mention, SuggestionDataItem } from "react-mentions";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import gravatar from "gravatar";

import {ChatArea, Form, SendButton, Toolbox, MentionsTextarea, EachMention} from '@components/ChatBox/styles';
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";

interface Props {
  chat: string;
  onSubmitForm : (e : any) => void;
  onChangeChat : (e : any) => void;
  placeholder ?: string;
}

const ChatBox:VFC<Props> = ({chat, onSubmitForm, onChangeChat, placeholder}) => {
  const { workspace } = useParams< {workspace : string} >();
  const {data : userData, error, mutate} = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const { data : memberData } = useSWR<IUser[]>(userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null, fetcher);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if(textareaRef.current){
      autosize(textareaRef.current);
    }
  }, []);

  const onKeydownChat = useCallback((e) => {
    console.log('onKeydownChat Hooks의 e 값 : ', e);
    if(e.key === 'Enter'){
      if(!e.shiftKey){
        onSubmitForm(e);
      }
    }
  }, [onSubmitForm]);

  const renderSuggestion = useCallback((suggestion: SuggestionDataItem, search: string, highlightedDisplay: React.ReactNode, index: number, focused: boolean):React.ReactNode => {
    if(!memberData){
      return;
    }
    return(
      <EachMention focus={focused}>
        <img src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
             alt={memberData[index].nickname} 
        />
        <span>{highlightedDisplay}</span>
      </EachMention>
    )
    }, [memberData]);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea id="editor-chat" value={chat} onChange={onChangeChat} onKeyPress={onKeydownChat} inputRef={textareaRef} placeholder={placeholder} allowSuggestionsAboveCursor >
          <Mention appendSpaceOnAdd
                   trigger="@"
                   data={memberData?.map((v) => ({id : v.id, display : v.nickname})) || []}
                   renderSuggestion={renderSuggestion}></Mention>
        </MentionsTextarea>
        <Toolbox>
          <SendButton className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            } data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}>
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
}

export default ChatBox