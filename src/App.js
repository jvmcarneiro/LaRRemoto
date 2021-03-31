import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route} from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import Sidebar from './components/Sidebar';

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
  {
    name: 'acesso',
    label: 'Acesso',
    path: '/',
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
  return (

    <React.Fragment>
      <Router>
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
        </div>
      </Router>
    </React.Fragment>
  );
}

export default App
