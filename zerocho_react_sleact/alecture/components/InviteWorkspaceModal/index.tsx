import React, { FC, useCallback } from "react";

import Modal from '@components/Modal';
import useInput from '@hooks/useinput';
import { Button, Input, Label } from '@pages/SignUP/styles';
import useSWR from "swr";
import { useParams } from "react-router";
import fetcher from "@utils/fetcher";
import { IChannel } from "@typings/db";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  show : boolean;
  onCloseModal : () => void;
  setShowInviteWorkspaceModal : (flag : boolean) => void;
}

const InviteWorkspaceModal : FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const { workspace } = useParams<{workspace : string}>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data : userData } = useSWR('http://localhost:3095/api/users', fetcher);
  const { mutate : mutateMembers } = useSWR<IChannel[]>(
    userData? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()){
      return;
    }

    axios.post(
      `http://localhost:3095/api/workspaces/${workspace}/members`,{
        email : newMember,
      },{
        withCredentials : true,
      }
    ).then((response) => {
      mutateMembers(response.data, false);
      setShowInviteWorkspaceModal(false);
      setNewMember('');
    }).catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position : 'bottom-center' });
    });
  }, [workspace, newMember])

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
}