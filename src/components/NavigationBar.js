import React from 'react';
import lar from '../resources/images/Logo-Lar.png'
import epufba from '../resources/images/logo_poli_azul.png'
import ufba from '../resources/images/Brasao-UFBA.png'
import { Nav } from 'react-bootstrap';

export const NavigationBar = () => (
  <div>
    <div className="toolbar" role="banner">
      <img className="#lab-logo"
        src={lar}
        width="60"
        alt="lar"
      />
      <Nav.Item><Nav.Link href="/">Laboratório de Robótica - Acesso Remoto e Virtual</Nav.Link></Nav.Item>
      <span></span>
      <div className="spacer"></div>
      <Nav.Item><Nav.Link href="/about">Sobre</Nav.Link></Nav.Item>
      <a aria-label="POLI" target="_blank" rel="noreferrer" href="http://www.eng.ufba.br/" title="POLI">
        <img
          src={epufba}
          width="280"
          alt="epufba"
        />
      </a>
      <a aria-label="UFBA" target="_blank" rel="noreferrer" href="https://www.ufba.br/" title="UFBA">
        <img
          src={ufba}
          width="40"
          alt="ufba"
        />
      </a>
    </div>
  </div>

)