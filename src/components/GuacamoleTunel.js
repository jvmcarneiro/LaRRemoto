import Guacamole from 'guacamole-common-js';
import React from 'react';
import encrypt from '../encrypt/encrypt.js';



class GuacamoleStage extends React.Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    const token = encrypt({
      connection: {
        type: 'rdp',
        settings: {
          hostname: '192.168.110.229',
          password: ''
        },
      },
    });
    var port = '4822';
    var host = window.location.hostname || '127.0.0.1';
    var wsprotocol = (window.location.protocol == 'https:') ? 'wss:' : 'ws:';
    //wsprotocol + '//' + host + ':' + port + '/guacamole'
    var tunnel = new Guacamole.WebSocketTunnel("ws?hostname=192.168.110.229&port=3389&width=1024&height=768&audio=audio/L16")
    var guac = this._client = new Guacamole.Client(tunnel);
    console.log('Created G token');
  }

  componentDidMount() {
    console.log('Created G client');
    var display = document.getElementById("display");
    display.appendChild(this._client.getDisplay().getElement());
    //this.myRef.current.appendChild(this.client.getDisplay().getElement());
    console.log('G Display added')
    this._client.connect();
    console.log("G inserted into DOM and connected");
  }

  // componentWillUnmount() {
  //   this._client.disconnect();
  // }

  render() {
    return <div ref={this.myRef} id="display" />;
  }
}

export default GuacamoleStage;
