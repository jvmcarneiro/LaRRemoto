import React from 'react';
import NoVNC from '@novnc/novnc';

class teste extends React.Component {
  render() {
    return (
      <NoVNC connectionName={this.props.connectionName}
        onDisconnected={this.onDisconnected}
        isSecure={true}
        actionsBar={(props) => <SomeActionsList onDisconnect={props.onDisconnect} />}
        passwordPrompt={(props) => <SomePasswordComponent onSubmit={props.onSubmit} />} />
    );
  }
}

export default teste;