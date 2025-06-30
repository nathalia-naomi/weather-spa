import React, { createContext, useReducer } from 'react';

const WeatherContext = createContext();

const initialState = {
  weather: null,
  loading: false,
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING': return { ...state, loading: true, error: '' };
    case 'SUCCESS': return { ...state, loading: false, weather: action.payload };
    case 'ERROR': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
