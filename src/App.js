import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import { Rodape } from './components/Rodape';
import Sidebar from './components/Sidebar';
//import { EnsureLoggedInContainer } from './containers/EnsureLoggedInContainer'

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Simulators } from './pages/Simulators';
import { Experiments } from './pages/Experiments';
import { Bibliography } from './pages/Bibliography';
import { Remote } from './pages/Remote';
import { UnderConstruction } from './pages/UnderConstruction';
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
      { name: 'profile', label: 'Perfil', path: '/profile', component: { UnderConstruction } }
    ],
  },
  {
    name: 'about',
    label: 'Sobre',
    path: '/about',
    component: { About }
  }
]

class App extends React.Component {
  componentDidUpdate(prevProps) {
    const { dispatch, redirectUrl } = this.props
    const isLoggingOut = prevProps.isLoggedIn && !this.props.isLoggedIn
    const isLoggingIn = !prevProps.isLoggedIn && this.props.isLoggedIn

    //if (isLoggingIn) {
    //  dispatch(navigateTo(redirectUrl))
    //} else if (isLoggingOut) {
    //  // do any kind of cleanup or post-logout redirection here
    //}
  }



  render() {
    return (

      <React.Fragment>
        <Router>
          <NavigationBar />

          <div style={{ display: "flex" }}>
            <Sidebar items={items} />

            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />

            <Route path="/simulators" component={Simulators} />
            <Route path="/experiments" component={UnderConstruction} />
            <Route path="/bibliography" component={Bibliography} />
            <Route path="/remote" component={Remote} />
            <Route path="/underConstruction" component={UnderConstruction} />
            <Route path="/profile" component={UnderConstruction} />

          </div>
          <Rodape />
        </Router>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.loggedIn,
    redirectUrl: state.redirectUrl
  }
}

export default App
