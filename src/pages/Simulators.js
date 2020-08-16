import React from 'react';
import Login from '../containers/Login';

export const Simulators = () => (
  <div class="Wrapper">
    <h2>Simuladores</h2>

    <p>Simule virtualmente com o ambiente de desenvolvimento do Gazebo</p>

    <p>Insira seu usu&aacute;rio e senha da rede da UFBA para continuar</p>
    <div style={{ width: "300px", marginLeft: "auto", marginRight: "auto" }}>
      <Login />
    </div>
  </div>
)