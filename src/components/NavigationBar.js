import React from 'react';
import { Nav } from 'react-bootstrap';
import AuthNav from "./auth-nav";

export const NavigationBar = () => (
  <div>
    <div class="toolbar" role="banner">
      <img class="#lab-logo"
        width="60"
        alt="lab Logo"
        src={require('../resources/images/Logo-Lar.png')}
      />
      <Nav.Item><Nav.Link href="/">Laborat&oacute;rio Virtual de Rob&oacute;tica</Nav.Link></Nav.Item>
      <span></span>
      <div class="spacer"></div>
      <Nav.Item><Nav.Link href="/about">Sobre</Nav.Link></Nav.Item>
      <a aria-label="POLI" target="_blank" rel="noopener" href="http://www.eng.ufba.br/" title="POLI">
        <img
          width="280"
          alt="lab Logo"
          src={require('../resources/images/logo_poli_azul.png')}
        />
      </a>
      <a aria-label="UFBA" target="_blank" rel="noopener" href="https://www.ufba.br/" title="UFBA">
        <img
          width="40"
          alt="lab Logo"
          src={require('../resources/images/Brasao-UFBA.png')}
        />
      </a>
    </div>

    <AuthNav />
  </div>

)