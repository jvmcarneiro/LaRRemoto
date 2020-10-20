import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import { Rodape } from './components/Rodape';
import Sidebar from './components/Sidebar';
import {Loading} from './components';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ProtectedRoute from "./auth/protected-route";

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Simulators } from './pages/Simulators';
import { Experiments } from './pages/Experiments';
import { Bibliography } from './pages/Bibliography';
import { Remote } from './pages/Remote';
import { UnderConstruction } from './pages/UnderConstruction';
import Profile from './pages/Profile';
import { NoMatch } from './pages/NoMatch';

const items = [
  {
    name: 'inicio',
    label: 'Inicio',
    path: '/',
    component: { Home }
  },
  {
    name: 'virtual',
    label: 'Virtual',
    items: [
      { name: 'simulators', label: 'Simuladores', path: '/simulators', component: { Simulators } },
      { name: 'experiments', label: 'Experimentos', path: '/experiments', component: { Experiments } },
      { name: 'bibliography', label: 'Bibliografia', path: '/bibliography', component: { Bibliography } },
    ],
  },
  {
    name: 'remoto',
    label: 'Remoto',
    items: [
      { name: 'remote', label: 'Acesso remoto', path: '/remote', component: { Remote } }
    ],
  },
  {
    name: 'settings',
    label: 'Configuracoes',
    items: [
      { name: 'profile', label: 'Perfil', path: '/profile', component: { Profile } }
    ],
  },
  {
    name: 'about',
    label: 'Sobre',
    path: '/about',
    component: { About }
  }
]

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (

    <React.Fragment>
      <Router>
        <NavigationBar />

        <div style={{ display: "flex" }}>
          <Sidebar items={items} />

          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/experiments" component={UnderConstruction} />
          <Route path="/bibliography" component={Bibliography} />
          <Route path="/underConstruction" component={UnderConstruction} />
          
          <ProtectedRoute path="/simulators" component={Simulators} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/remote" component={Remote} />
        </div>
        <Rodape />
      </Router>
    </React.Fragment>
  );
}

export default App
