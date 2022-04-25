import React, { FC, useState, useCallback, useEffect } from "react";

import { CollapseButton } from '@components/DMList/styles';
import { IUser, IUserWithOnline, IDM } from '@typings/db';
import fetcher from '@utils/fetcher';
import useSocket from "@hooks/useSocket";

import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

const DMList : FC = () => {
  const { workspace } = useParams<{ workspace? : string }>();
  const { data : userData, error, mutate } = useSWR<IUser>('http://localhost:3095/api/users', fetcher);
  const { data : memberData } = useSWR<IUserWithOnline[]>(userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null, fetcher);
  const [socket] = useSocket(workspace);

  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{[key : string] : number}>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const resetCount = useCallback((id) => () => {
    setCountList((list) => {
      return {
        ...list,
        [id] : 0,
      };
    });
  }, []);

  const onMessage = (data : IDM) => {
    console.log('dm  왔다.', data);
    setCountList((list) => {
      return{
        ...list,
        [data.SenderId] : list[data.SenderId] ? list[data.SenderId] + 1 : 1,
      }
    });
  }

  useEffect(() => {
    console.log('DMList : workspace 바꼈다.', workspace);
    setOnlineList([]);
    setCountList({});
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data:number[]) => {
      setOnlineList(data);
    });

    return () => {
      socket?.off('onlineList');
    }
  }, [socket]);
  
  return(
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline" data-qa="channel-section-collapse"
            aria-hidden="true"></i>
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            const count = countList[member.id] || 0;
            return (
            <NavLink key={member.id} className={member.id === userData?.id ?"selected" : ""} to={`/workspace/${workspace}/dm/${member.id}`} onClick={resetCount(member.id)}>
              <i
                className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                  isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                }`}
                aria-hidden="true"
                data-qa="presence_indicator"
                data-qa-presence-self="false"
                data-qa-presence-active="false"
                data-qa-presence-dnd="false"
              />
              <span className={count > 0 ? 'bold' : undefined}>{member.nickname}</span>
              {member.id === userData?.id && <span> (나)</span>}
              {count > 0 && <span className="count">{count}</span>}
            </NavLink>
          );
        })}
      </div>
    </>
  )
}

export default DMList;