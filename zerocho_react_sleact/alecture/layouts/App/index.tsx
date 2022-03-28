import React from "react";
import loadable from '@loadable/component';
import {Routes, Route, Navigate} from 'react-router-dom';
// import Workspace from "@layouts/Workspace";

const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUP'));
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
// const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
    return(
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/workspace/:workspace" element={<Workspace />} /> */}
        <Route path="/workspace/:workspace/channel/:channel" element={<Channel />} />
        <Route path="/workspace/:workspace/dm/:dm" element={<DirectMessage />} />
      </Routes>
    );
};

export default App;