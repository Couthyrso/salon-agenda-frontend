import React from 'react';
import { Route, Routes } from 'react-router-dom';

import SignIn from './views/auth/sign-in';
import Home from './views/home/index';

export default function AppRoutes() {

    return (
        <Routes>
            <Route path='/' element={<SignIn />}/>
            <Route path='/auth/sign-in' element={<SignIn />}/>          
            <Route path='/home' element={<Home />}/>
        </Routes>
    )
}