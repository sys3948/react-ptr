import React, {useCallback, VFC} from "react";

import Modal from "@components/Modal";
import useInput from "@hooks/useinput";

import {Label, Input, Button} from "@pages/SignUP/styles";

interface Props {
  show : boolean;
  onCloseModal : () => void;
}

const CreateChannelModal : VFC<Props> = ({ show, onCloseModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  const onCreateChannel = useCallback(() => {}, []);

  if(!show){
    return null;
  }

  return(
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type='submit'>생성하기</Button>
      </form>
    </Modal>
  ) 
}

export default CreateChannelModal;