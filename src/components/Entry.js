import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { updateEntry, deleteEntry } from '../actions';

class Entry extends React.Component {

  state = {
    isEditClicked: false,
    isDeleteClicked: false,
    editedContent: this.props.entry.content,
  }

  editContentChangeHandler = (e) => {
    this.setState({
      editedContent: e.target.value,
    });
  }

  editBtnClickHandler = () => {
    this.setState({
      isEditClicked: !this.state.isEditClicked,
    });
  }

  deleteBtnClickHandler = () => {
    this.setState({
      isDeleteClicked: !this.state.isDeleteClicked,
    });
  }

  submitBtnHandler = () => {
    
    axios.patch('http://localhost:8080/entries/' + this.props.entry._id, {
      content: this.state.editedContent,
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'), 
      }, 
    }).then((res) => {

      let localStorageEntries = JSON.parse(localStorage.getItem('entries'));
 
      for(let index = 0; index < localStorageEntries.length; ++index){
 
        if(localStorageEntries[index]._id === res.data._id){
          localStorageEntries[index].content = this.state.editedContent;
          break;
        }
        
      }

      localStorage.setItem('entries', JSON.stringify(localStorageEntries));

      this.setState({
        isEditClicked: false,
        isDeleteClicked: false,
      });
      
      this.props.updateEntry({
        updatedEntries: localStorageEntries,
        entryUpdated: res.data,
        newContent: this.state.editedContent,
      });

      
      alert('Entry Updated!');
    });
  }

  deleteEntry = () =>{
    
    axios.delete('http://localhost:8080/entries/' + this.props.entry._id, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'), 
      }, 
    }).then((res) => {
      
      let localStorageEntries = JSON.parse(localStorage.getItem('entries'));

      localStorageEntries = localStorageEntries.filter((entry) => {
        return entry._id !== res.data._id;
      });

      localStorage.setItem('entries', JSON.stringify(localStorageEntries));

      this.setState({
        isDeleteClicked: !this.state.isDeleteClicked,
      });

      this.props.deleteEntry(res.data);

      alert('Entty deleted!');
    });
  }

  render(){
    return (
      <div autoFocus={true} className='entryContainer'>
        <div className='entryDate'>
          {this.props.entry.entryDate}
        </div>
        <div>
          <button onClick={this.editBtnClickHandler}>Edit</button>
          {' '}
          <button onClick={this.deleteBtnClickHandler}>Delete</button>
        </div>
        <p 
          className='entryContent'
        >{this.props.entry.content}</p>
        {this.state.isEditClicked ? 
          <div>
            <textarea 
              autoFocus={true} 
              id='content' 
              cols='60' 
              rows='20' 
              onChange={this.editContentChangeHandler}
              value={this.state.editedContent}
            />
            <br />
            <button onClick={this.submitBtnHandler}>Submit</button>
          </div>
          :
          null
        }
        {this.state.isDeleteClicked ? 
          <div className='deleteForm'>
            <p>
              Are you sure you want to delete this entry?
            </p>
            <div>
              <button onClick={this.deleteEntry}>Yes</button>
              {' '}
              <button 
                autoFocus={true} 
                onClick={() => {
                  this.setState({
                    isDeleteClicked: !this.state.isDeleteClicked,
                  })
                }}
              >No</button>
            </div>
          </div>
          :
          null
        }
        <br />
      </div>    
    );   
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user,
    entries: state.entries,
  };
}

export default connect(mapStateToProps, { updateEntry, deleteEntry })(Entry);