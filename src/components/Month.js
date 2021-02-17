import React from 'react';
import { connect } from 'react-redux';
import { setShowMonthlyEntries } from '../actions';

class Month extends React.Component {


  render() {
    return (
      <div className='month'>
        <div onClick={() => {
          this.props.setShowMonthlyEntries(this.props.index); //this sends the month
        }}>
          {this.props.month}
        </div>
      </div>
    );    
  };
};


const mapStateToProps = (state) => {
  return {
    filteredEntriesByYear: state.filteredEntriesByYear,    
  };
}

export default connect(mapStateToProps, { setShowMonthlyEntries })(Month);

