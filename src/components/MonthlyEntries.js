import React from 'react';
import { connect } from 'react-redux';
import { setShowMonthlyEntries } from '../actions';
import Entry from './Entry';

class MonthlyEntries extends React.Component{

  render (){
    return (
      <div className='monthlyEntriesContainer'>
        {
          this.props.filteredEntriesByMonth.map((entry, index) => {
            return <Entry 
              key ={index}
              entry = {entry}
            />
          })
        }
      </div>    
    );
  }
}

const mapStateToProps = (state) => {
  return {
    filteredEntriesByMonth: state.filteredEntriesByMonth,
  };
}

export default connect(mapStateToProps, { setShowMonthlyEntries })(MonthlyEntries);