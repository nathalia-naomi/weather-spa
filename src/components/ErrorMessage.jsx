import React, { useContext } from 'react';
import { Alert } from 'react-bootstrap';
import WeatherContext from '../contexts/WeatherContext';

export default function ErrorMessage() {
  const { state } = useContext(WeatherContext);
  return state.error ? <Alert variant="danger">{state.error}</Alert> : null;
}
