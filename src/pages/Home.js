import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div class="Wrapper">
        <div style={{ textAlign: "center" }}>
          <h1>Bem vindo ao Laboratório de Robótica!</h1>
          <p>Para começar, navegue até a área desejada através do menu lateral.</p>
        </div>
      </div>
    );
  }
}
