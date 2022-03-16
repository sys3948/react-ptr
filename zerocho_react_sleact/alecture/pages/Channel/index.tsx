import Workspace from "@layouts/Workspace";
import { Container, Header } from "@pages/Channel/styles";
import React from "react";

const Channel = () => {
  console.log('채널로 들어왔어요!');
  return (
    <Workspace>
      <Container>
        <Header>채널!</Header>
      </Container>
    </Workspace>
  );
}

export default Channel;