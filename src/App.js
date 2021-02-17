// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Entries from './components/Entries';
import { connect } from 'react-redux';

class App extends React.Component {

  render () {
    return (
      <div className="App">
        <header className="App-header">
          { localStorage.getItem('currentUser') && localStorage.getItem('token') ? (
            <Redirect to="/entries" />
          ) : (
            <Redirect to="/" />
          )}
          <Route exact path="/">
            <h1>DIARY APP</h1>
            <LoginForm />
            <div>Not yet a member? Register <Link to={'/register'}>here</Link></div>
          </Route>
  
          <Route exact path="/register">
            <RegistrationForm />
          </Route>

          <Route exact path="/entries">
            <Entries />
          </Route>

        </header>
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    currentUser: state.user,
  };
}

export default connect(mapStateToProps)(App);
