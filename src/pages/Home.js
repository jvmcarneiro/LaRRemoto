import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div class="Wrapper">
        <div style={{ textAlign: "center" }}>
          <h1>Bem vindo ao laborat&oacute;rio virtual remoto de rob&oacute;tica!</h1>
          <p>Para come&ccedil;ar, acesse pelo menu lateral os itens do laborat&oacute;rio virtual ou remoto</p>
        </div>
      </div>
    );
  }
}
