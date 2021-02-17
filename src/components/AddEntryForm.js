import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { setEntries, addEntry } from '../actions';

class AddEntryForm extends React.Component {

  state = {
    dateForm: '',
    contentForm: '',
  }

  dateChangeHandler = (e) => {
    this.setState({
        dateForm: e.target.value,  
    });

  }

  contentChangeHandler = (e) => {
    this.setState({
        contentForm: e.target.value,  
    });
  }

  submitFormHandler = (e) => {
    this.setState({
      dateForm: '',
      contentForm: '',
    });
    this.addNewEntryHandler();
    this.props.toggleAddEntryForm();
    e.preventDefault();
  }

  addNewEntryHandler = () => {
    
    axios.post('http://localhost:8080/entries', {
      user_id: this.props.currentUser._id,
      entryDate: this.state.dateForm,
      content: this.state.contentForm,
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'), 
      }, 
    }).then(res => {
      
      let localStorageEntries = JSON.parse(localStorage.getItem('entries'));
      localStorageEntries.push(res.data);
      localStorage.setItem('entries', JSON.stringify(localStorageEntries));

      this.props.addEntry(res.data);

      alert('Entry Added!');
    });
  }

  render(){
    return(
      <div>
        <form onSubmit={this.submitFormHandler}>
          <br />
          <label htmlFor='date'>Journal Entry Date:</label>
          <br />
          <input type='date' id='date' required onChange={this.dateChangeHandler}/>
          <br />
          <br />
          <label htmlFor='content'>Journal Entry Content:</label>
          <br />
          <textarea autoFocus={true} id='content' cols='60' rows='20' onChange={this.contentChangeHandler}/>
          <br />
          <input type='submit' value='Save' />
        </form>
        <br />
      </div>    
    );  
  }    
}

const mapStateToProps = (state) => {
    return {
      currentUser: state.user,
    };
}

export default connect(mapStateToProps, { setEntries, addEntry })(AddEntryForm);