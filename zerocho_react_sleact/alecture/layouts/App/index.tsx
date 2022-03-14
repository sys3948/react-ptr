import React from "react";
import loadable from '@loadable/component';
import {Routes, Route, Navigate} from 'react-router-dom';
import Workspace from "@layouts/Workspace";

const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUP'));
const Channel = loadable(() => import('@pages/Channel'))

const App = () => {
    return(
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/channel" element={<Channel />} />
      </Routes>
    );
};

export default App;