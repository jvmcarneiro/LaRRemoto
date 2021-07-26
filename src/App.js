import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Route } from "react-router-dom";

import useToken from './useToken';

import { NavigationBar } from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Preferences from './components/Preferences';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Server } from './pages/Server';
import { Resources } from './pages/Resources';
import { Experiments } from './pages/Experiments';
import { Bibliography } from './pages/Bibliography';
import { UnderConstruction } from './pages/UnderConstruction';

const items = [
  {
    name: 'inicio',
    label: 'Inicio',
    path: '/',
    component: { Home }
  },
  { name: 'acesso',
    label: 'Acesso',
    path: '',
    items: [
      { name: 'server', label: 'Servidor', path: '/server', component: { Server } },
      { name: 'resources', label: 'Recursos', path: '/resources', component: { Resources } },
      { name: 'experiments', label: 'Experimentos', path: '/experiments', component: { Experiments } },
      { name: 'bibliography', label: 'Bibliografia', path: '/bibliography', component: { Bibliography } },
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
  const { token, setToken } = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <>
      <BrowserRouter>
      <NavigationBar />
        <div style={{ display: "flex" }}>
          <Sidebar items={items} />
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/experiments" component={Experiments} />
          <Route path="/bibliography" component={Bibliography} />
          <Route path="/underConstruction" component={UnderConstruction} />
          <Route path="/resources" component={Resources} />
          <Route path="/server" component={Server} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/preferences" component={Preferences} />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App
