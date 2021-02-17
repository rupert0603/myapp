import React from 'react';
import Month from './Month';
import { connect } from 'react-redux';
import { setSelectedYear } from '../actions';

const months = [
  "Jan", "Feb", "Mar", "Apr", 
  "May", "Jun", "Jul", "Aug", 
  "Sep", "Oct", "Nov", "Dec"
];

class Calendar extends React.Component {

  previousClickHandler = () => {
    this.props.setSelectedYear(this.props.year - 1);  
  }

  nextClickHandler = () => {
    this.props.setSelectedYear(this.props.year + 1);
  }


  render() {
    return (
      <div>
        <div>
          <span className='yearChanger' onClick={this.previousClickHandler}>Previous</span>
          <span> {this.props.year} </span>
          <span className='yearChanger' onClick={this.nextClickHandler}>Next</span>
        </div>
        <br />
        <div className='monthsContainer'>
            {months.map((month, index) => {
              return <Month 
                month={month} //string verion of month
                key={month}
                index={index} //will also act as numeric form of month
              />
            })}
          </div>
          <br />
      </div>
    );    
  };
};

const mapStateToProps = (state) => {

    return {
      year: state.yearSelected,   
    };
}

export default connect(mapStateToProps, { setSelectedYear })(Calendar);
