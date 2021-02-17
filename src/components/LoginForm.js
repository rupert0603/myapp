import React from 'react';
import axios from 'axios';
import { login } from '../actions';
import { connect } from 'react-redux';

class LoginForm extends React.Component {
  
  state = {
    username: "",
    password: "",    
  }

  loginBtnHandler = () => {
    axios.post('https://nameless-reaches-87715.herokuapp.com/', this.state).then((res) => {
      if(res.data.error){
        alert(res.data.error);
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('currentUser', JSON.stringify(res.data.userFound));

        this.props.login(
          res.data.userFound, 
        );
      }
    });
  }

  render(){
    return(
      <div>
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
        <button onClick={ this.loginBtnHandler }>Login</button>
      </div>    
    );    
  }
}

export default connect(null, { login })(LoginForm);
