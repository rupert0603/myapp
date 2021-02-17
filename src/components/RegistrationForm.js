import React from 'react';
import { login } from '../actions';
import { connect } from 'react-redux';
import axios from 'axios';

class RegistrationForm extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',    
  }

  register = () => {

    if(this.state.confirmPassword !== this.state.password){
      return (alert(`Passwords doesn't match. Please type the same passwords`));
    }

    axios.post('http://localhost:8080/register', this.state).then((res) => {

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('currentUser', JSON.stringify(res.data.userData));
      
      this.props.login(
        res.data.userData,
      );
    });
  }

  render () {
    return(
      <div>
        First Name:{' '}
        <input 
          type="text" 
          value={this.state.firstName}
          onChange={(e) => { this.setState({ firstName: e.target.value }) }}
        />
        <br />
        Last Name:{' '}
        <input 
          type="text" 
          value={this.state.lastName}
          onChange={(e) => { this.setState({ lastName: e.target.value }) }}
        />
        <br />
        Username:{' '}
        <input 
          type="text" 
          value={this.state.username}
          onChange={(e) => { this.setState({ username: e.target.value }) }}
        />
        <br />
        Password:{' '}
        <input 
          type="password" 
          value={this.state.password}
          onChange={(e) => { this.setState({ password: e.target.value }) }}
        />
        <br />
        Confirm Password:{' '}
        <input 
          type="password" 
          value={this.state.confirmPassword}
          onChange={(e) => { this.setState({ confirmPassword: e.target.value }) }}
        />
        <br />
        <button onClick={ this.register }>Register</button>
      </div>
    );    
  }    
}

export default connect(null, { login })(RegistrationForm);
