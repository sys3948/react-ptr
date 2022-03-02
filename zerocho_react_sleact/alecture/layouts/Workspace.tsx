import fetcher from '@utils/fetcher';
import axios from 'axios';

import React, {FC, useCallback} from "react";
import useSWRImmutable from 'swr/immutable';

const Workspace:FC = ({children}) => {
  const {data, error, mutate} = useSWRImmutable('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials : true,
    }).then(() => {
        mutate();
    });
  }, []);

  return(
    <div>
      <button onClick={onLogout}>로그 아웃</button>
      {children}
    </div>
  );
}

export default Workspace;