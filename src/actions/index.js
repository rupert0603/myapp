export const login = (user) => {
  return {
    type: 'LOGIN',
    payload: user
  }
}

export const setEntries = (entries) => {
  return {
    type: 'SET_ENTRIES',
    payload: entries,
  }
}

export const setUser = () => {
  return {
    type: 'SET_USER',
  }
}

export const setSelectedYear = (year) => {
  return {
    type: 'SET_SELECTED_YEAR',
    payload: year,
  }
}

export const setShowMonthlyEntries = (clickedMonthData) => {
  return {
    type: 'SET_SHOW_MONTHLY_ENTRIES',
    payload: clickedMonthData, 
  }
}

export const updateEntry = (dataUpdated) => {
  return {
    type: 'UPDATE_ENTRY',
    payload: dataUpdated,
  }
}

export const addEntry = (newEntry) => {
  return {
    type: 'ADD_ENTRY',
    payload: newEntry,
  }
}

export const deleteEntry = (deletedEntry) => {
  return {
    type: 'DELETE_ENTRY',
    payload: deletedEntry,
  }

}

export const logout = () => {
  return {
    type: 'LOGOUT',
  }
}
