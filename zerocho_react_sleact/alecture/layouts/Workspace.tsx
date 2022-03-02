import fetcher from '@utils/fetcher';
import axios from 'axios';

import React, {FC, useCallback} from "react";
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import {Routes, Route, Navigate} from 'react-router-dom';

const Workspace:FC = ({children}) => {
  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials : true,
    }).then((response) => {
        mutate(response.data);
    });
  }, []);

  if(!data){
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return(
    <div>
      <button onClick={onLogout}>로그 아웃</button>
      {children}
    </div>
  );
}

export default Workspace;