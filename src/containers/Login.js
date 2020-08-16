import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      password: ""
    };

  }

  renderCall() {
    this.StartServer();
    //return ({ CallServer });
  }

  objToQueryString(obj) {
    const keyValuePairs = [];
    for (let i = 0; i < Object.keys(obj).length; i += 1) {
      keyValuePairs.push(`${encodeURIComponent(Object.keys(obj)[i])}=${encodeURIComponent(Object.values(obj)[i])}`);
    }
    return keyValuePairs.join('&');
  }

  async StartServer() {
    const queryString = this.objToQueryString({
      user: this.state.user,
      password: this.state.password,
    });
    fetch(`terminal/Start?${queryString}`);
    this.setState({ loading: false });
  }

  validateForm() {
    return this.state.user.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


  handleSubmit = event => {
    event.preventDefault();
    this.renderCall();
  }

  render() {
    return (
      <div className="Login">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="user" bsSize="large">
            <Form.Control
              autoFocus
              type="user"
              value={this.state.user}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password" bsSize="large">
            <Form.Control
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </Form.Group>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            onclick={this.handleSubmit}
          >
            Login
              </Button>
        </Form>
      </div>
    );
  }
}