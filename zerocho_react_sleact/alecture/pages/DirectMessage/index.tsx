import React from "react";
import Workspace from "@layouts/Workspace";
import {Container, Header} from "@pages/DirectMessage/styles";
import gravatar from 'gravatar';
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";

const DirectMessage = () => {
  const {workspace, id} = useParams<{workspace:string; id:string}>();
  const {data: userData} = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`, fetcher)
  console.log(userData);
  console.log(workspace);
  console.log(id);
  return (
    <Workspace>
      <Container>
        <Header>
          <img src={gravatar.url(userData.email, {s: '24px', d: 'retro'})} alt={userData.nickname} />
          <span>{userData.nickname}</span>
        </Header>
        {/* <ChatList> */}
        {/* <ChatBox> */}
      </Container>
    </Workspace>
  );
};

export default DirectMessage;