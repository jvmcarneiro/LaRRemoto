import React from 'react';

export class Server extends React.Component {
  render() {
    const guacamole = `${window.location.origin}/guacamole`;
    window.setTimeout(function() {
      window.location.replace(guacamole);
    }, 1500);
    
    return(
      <div class="Wrapper">
        <h2>Redirecionando para autenticação do servidor...</h2>
        <div>Caso não seja redirecionado automaticamente, <a href={guacamole}>clique aqui</a></div>
      </div>
    );
  }
}
