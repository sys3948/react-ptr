import React, {FC, useCallback} from "react";

import Modal from '@components/Modal';
import useInput from '@hooks/useinput';
import { useParams } from "react-router";

import {Label, Input, Button} from "@pages/SignUP/styles";
import useSWR from "swr";
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  show : boolean;
  onCloseModal : () => void;
  setShowInviteChannelModal : (flag : boolean) => void;
}

const InviteChannelModal : FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{workspace : string; channel : string}>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data : userData } = useSWR<IUser>('http://localhost:3095/api/users', fetcher);
  const { mutate : mutateMembers } = useSWR<IUser[]>(
    userData && channel ? `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if(!newMember || !newMember.trim()){
      return;
    };

    axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members`, {
      email : newMember,
    }, {
      withCredentials : true,
    }).then((response) => {
      mutateMembers(response.data, false);
      setShowInviteChannelModal(false);
      setNewMember('');
    }).catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, {position : 'bottom-center'});
    })
  }, [])

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>채널 멤버 초대</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
}

export default InviteChannelModal;