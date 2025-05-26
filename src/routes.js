import React from 'react';
import { Route, Routes } from 'react-router-dom';

import SignIn from './views/auth/sign-in';
import Home from './views/home/index';
import HomeAdm from './views/homeadm/indexadm';
import Gerenciador from './views/gerenciador/consultaadm';
import Agendamento from './views/agenda/agendamento';
import MeusAgendamentos from './views/agenda/meus-agendamentos';
import SobreNos from './views/sobre-nós/sobrenos';

export default function AppRoutes() {

    return (
        <Routes>
            <Route path='/' element={<SignIn />}/>
            <Route path='/auth/sign-in' element={<SignIn />}/>          
            <Route path='/home' element={<Home />}/>
            <Route path='/homeadm' element={<HomeAdm />}/>
            <Route path='/gerenciador' element={<Gerenciador />}/>
            <Route path='/agendamento' element={<Agendamento />}/>
            <Route path='/meus-agendamentos' element={<MeusAgendamentos />}/>
            <Route path='/sobrenos' element={<SobreNos />}/>
        </Routes>
    )
}