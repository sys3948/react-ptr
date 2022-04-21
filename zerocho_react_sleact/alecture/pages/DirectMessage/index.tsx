import React from "react";
import gravatar from 'gravatar';
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";

import Workspace from "@layouts/Workspace";
import {Container, Header} from "@pages/DirectMessage/styles";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";

const DirectMessage = () => {
  const {workspace, dm} = useParams<{workspace:string; dm:string}>();
  const {data: userData} = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${dm}`, fetcher);
  const {data: myData} = useSWR('http://localhost:3095/api/users', fetcher);

  return (
    <Workspace>
      <Container>
        <Header>
          <img src={userData ? gravatar.url(userData.email, {s: '24px', d: 'retro'}) : ""} alt={userData ? userData.nickname : ""} />
          <span>{userData ? userData.nickname : "존재하지 않는 사용자입니다."}</span>
        </Header>
        <ChatList />
        <ChatBox chat="" />
      </Container>
    </Workspace>
  );
};

export default DirectMessage;