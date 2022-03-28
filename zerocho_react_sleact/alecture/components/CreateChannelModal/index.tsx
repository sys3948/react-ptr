import React, {useCallback, VFC} from "react";

import Modal from "@components/Modal";
import useInput from "@hooks/useinput";

import {Label, Input, Button} from "@pages/SignUP/styles";
import { useParams } from "react-router";
import useSWR from "swr";
import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  show : boolean;
  onCloseModal : () => void;
  setShowCreateChannelModal : (flag: boolean) => void;
}

const CreateChannelModal : VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{workspace : string, channel : string}>();
  const { data : userData, error } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const { data : channelData, mutate : mutateChannel } = useSWR<IChannel[]>(
    userData?`http://localhost:3095/api/workspaces/${workspace}/channels`:null, fetcher);

  const onCreateChannel = useCallback((e) => {
    e.preventDefault();
    axios.post(
      `http://localhost:3095/api/workspaces/${workspace}/channels`,
      {
        name : newChannel,
      },
      {
        withCredentials : true,
      },
    ).then((response) => {
      setShowCreateChannelModal(false);
      mutateChannel();
      setNewChannel('');
    }).catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, {position : 'bottom-center'});
    });
  }, [newChannel]);

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