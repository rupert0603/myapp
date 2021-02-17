import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { setEntries, logout } from '../actions';
import { Redirect } from 'react-router-dom';
import AddEntryForm from './AddEntryForm';
import Calendar from './Calendar';
import MonthlyEntries from './MonthlyEntries';

class Entries extends React.Component {

  state = {
    showAddEntryForm: false,
    isLogoutClicked: false,
  }

  componentDidMount(){
    if(localStorage.getItem('currentUser')){
      axios.get('https://nameless-reaches-87715.herokuapp.com/', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'), 
        },
  
        params: {
          user_id: this.props.currentUser._id,
        }
      }).then(res => {
        localStorage.setItem('entries', JSON.stringify(res.data.entries));
        
        this.props.setEntries(
          res.data.entries,
        );

      }); 
    }

  }

  toggleAddEntryForm = () => {
    this.setState({
      showAddEntryForm: false,
    });
  }

  logoutHandler = () => {

    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('entries');

    this.setState({
      isLogoutClicked: true,
    });
    
    this.props.logout();

  }

  render(){ 
    return (
      <div className='mainContainer'> 
        {localStorage.getItem('currentUser') && localStorage.getItem('token') ?
          <div>
            <nav>
              <span>{JSON.parse(localStorage.getItem('currentUser')).username}</span>
              <span className='logout' onClick={this.logoutHandler}>Logout</span>
            </nav>
            <p>
              Hello, {this.props.currentUser.firstName}! How was your day?
            </p>      
            <br />
            <div 
              onClick = {() => {this.setState({showAddEntryForm: !this.state.showAddEntryForm})}}
              className = 'addNewEntry'  
            >
              Add New Entry
            </div>
            {
              this.state.showAddEntryForm ? 
              <AddEntryForm toggleAddEntryForm={this.toggleAddEntryForm}/> : null
            }
            <br />
            <Calendar />
            {this.props.showMonthlyEntries ? <MonthlyEntries /> : null}
          </div>  :
          <div><Redirect to="/" /></div>
        }
      </div>  
    );    
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user,
    showMonthlyEntries: state.showMonthlyEntries,
  };
}

export default connect(mapStateToProps, { setEntries, logout })(Entries);