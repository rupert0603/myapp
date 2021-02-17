let currentUser;
let entries = [];
let filteredEntries;
let newFilteredEntriesByYear;
let newFilteredEntriesByMonth;
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const filterEntriesByYear = (entries, year) => {
  let filteredEntries;

  filteredEntries = entries.filter((entry) => {
    return entry.entryDate.slice(0, 4)*1 === year;
  });

  return filteredEntries;
  
}

const filterEntriesByMonth = (entries, month) => {

  let filteredEntries;

  filteredEntries = entries.filter((entry) => {
    return (entry.entryDate.slice(5,7)*1)  === month;
  });
  filteredEntries = sortMonthEntries(filteredEntries);

  return filteredEntries;
}

const sortMonthEntries = (entries) => {
  let sortedEntries = entries;
  
  for(let i = 0; i < sortedEntries.length-1; ++i){

    let lowest = sortedEntries[i];
    let index = i;
    
      for(let j = i+1; j <= sortedEntries.length-1 ; ++j){

        if(lowest.entryDate.slice(8)*1 > sortedEntries[j].entryDate.slice(8)*1){
          lowest = sortedEntries[j];
          index = j;
        }
  
      }
  
    sortedEntries[index] = sortedEntries[i];  
    sortedEntries[i] = lowest;
  
    index = 0; 
  }

  return sortedEntries;
}

//initialize state
if(localStorage.getItem('currentUser') && localStorage.getItem('token')){
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  entries = JSON.parse(localStorage.getItem('entries'));
} else {
  currentUser = null;
  entries = [];
}

//initialize state
if(entries){
  filteredEntries = filterEntriesByYear(entries, currentYear);
} else {
  filteredEntries = [];
}

const initialState = {
  user: currentUser,
  entries: entries,
  yearSelected: currentYear,
  filteredEntriesByYear: filteredEntries, 
  showMonthlyEntries: false, //updates once user clicks month
  filteredEntriesByMonth: [], //will only have content once user clicks a month, 
  currentMonthShown: -1, //updates once user clicks a month; -1 means there's no month selected
};

const reducer = (state = initialState, action) => {
  switch(action.type){

    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    
    case 'SET_ENTRIES':
      
      newFilteredEntriesByYear = filterEntriesByYear(action.payload, state.yearSelected);
      //on the first load of the entroes, we will not sort it by month since user still
      //has not selected a month      

      return {
        ...state,
        entries: action.payload,
        filteredEntriesByYear: newFilteredEntriesByYear,
      };

    case 'ADD_ENTRY':
      let monthOfEntryAdded = action.payload.entryDate.slice(5,7)*1;
      newFilteredEntriesByMonth = state.filteredEntriesByMonth;

      let {entries: newEntries} = state;
      newEntries.push(action.payload);

      //update entries in currently selected year
      if(action.payload.entryDate.slice(0, 4)*1 === state.yearSelected){
        newFilteredEntriesByYear = state.filteredEntriesByYear;
        newFilteredEntriesByYear.push(action.payload);
      }

      //if page is currently showing a monthly entries, update the entries in currently selected month
      //filter the filteredEntriesByYear to get a updated list of the filtered entries by month
      //if there is no month selected/shown, then no need to filter the month
      if(state.currentMonthShown !== -1 && monthOfEntryAdded === state.currentMonthShown+1){
          newFilteredEntriesByMonth = filterEntriesByMonth(
            newFilteredEntriesByYear, 
            state.currentMonthShown+1 //add one since currentMonthShown starts at zero for January
          );

      }

      return {
        ...state,
        entries: newEntries,
        filteredEntriesByYear: newFilteredEntriesByYear,
        filteredEntriesByMonth: newFilteredEntriesByMonth,
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: JSON.parse(localStorage.getItem('currentUser')),
      };

    case 'SET_SELECTED_YEAR':

      newFilteredEntriesByYear = filterEntriesByYear(state.entries, action.payload);
      
      return {
        ...state,
        yearSelected: action.payload,
        filteredEntriesByYear: newFilteredEntriesByYear,
        showMonthlyEntries: false, 
        filteredEntriesByMonth: [],
        currentMonthShown: -1,
        //when year selected is changed, we want to rest the page, showing no list of monthly entries
      };

    case 'SET_SHOW_MONTHLY_ENTRIES':

      let newShowMonthlyEntries;
      let newCurrentMonthShown;

      if (action.payload !== state.currentMonthShown) {
        newShowMonthlyEntries = true;

        //if the month clicked is not the same as what's currently shown (including NONE aka -1),
        //then set the showMonthlyEntries to true to show the month clicked

      } else {
        newShowMonthlyEntries = !state.showMonthlyEntries;
        //if the same month is clicked, then just toggle it
      }

      //if newCurrentMonthShown is false (hidden), then set the relevant state properties to blank
      if(!newShowMonthlyEntries){
        newCurrentMonthShown = -1;
        newFilteredEntriesByMonth = [];
      } else {
        newCurrentMonthShown = action.payload;
        newFilteredEntriesByMonth = filterEntriesByMonth(
          state.filteredEntriesByYear,
          action.payload+1 //add one since action.payload starts at zero for January
        );
      }

      return {
        ...state,
        showMonthlyEntries: newShowMonthlyEntries,
        filteredEntriesByMonth: newFilteredEntriesByMonth,
        currentMonthShown: newCurrentMonthShown,
      };


    case 'UPDATE_ENTRY':

      entries = state.entries;

      //update the entries
      entries = entries.map((entry) => {
        if (entry._id === action.payload.entryUpdated._id){
          entry.content = action.payload.newContent;
        }

        return entry;
      });

      //update the entriesfilteredyear
      newFilteredEntriesByYear = filterEntriesByYear(entries, state.yearSelected);

      //update the entriesfilteredmonth
      newFilteredEntriesByMonth = filterEntriesByMonth(entries, state.currentMonthShown+1);

      return {
        ...state,
        entries: entries,
        filteredEntriesByYear: newFilteredEntriesByYear,
        filteredEntriesByMonth: newFilteredEntriesByMonth,
      };

    case 'DELETE_ENTRY':

      newFilteredEntriesByMonth = state.filteredEntriesByMonth;
      
      //remove the deleted entry from the state.entries
      entries = state.entries.filter((entry) => {
        return entry._id !== action.payload._id;
      });

      //filter the state.entries again by year
      newFilteredEntriesByYear = filterEntriesByYear(entries, state.yearSelected);
      
      newFilteredEntriesByMonth = newFilteredEntriesByMonth.filter((entry) => {
        return entry._id !== action.payload._id;
      });

      return {
        ...state,
        entries: entries,
        filteredEntriesByYear: newFilteredEntriesByYear,
        filteredEntriesByMonth: newFilteredEntriesByMonth,
      }

    case 'LOGOUT':
      //turn state into default values
      return {
        user: null,
        entries: [],
        yearSelected: currentYear,
        filteredEntriesByYear: [], 
        showMonthlyEntries: false, 
        filteredEntriesByMonth: [],  
        currentMonthShown: -1, 
      };

    default:
      return state;
  }
  
};

export default reducer;


