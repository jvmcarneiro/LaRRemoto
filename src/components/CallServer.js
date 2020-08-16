import React, { Component } from 'react';

export class CallServer extends Component {
  static displayName = CallServer.name;

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.StartServer();
  }


  render() {
    return (
      <div>
        <h1 id="tabelLabel" >TESTE forecast</h1>
        <p>TESTE.</p>
      </div>
    );
  }

  async StartServer() {
    await fetch('startterminalservicecontroller');
    this.setState({ loading: false });
  }
}
