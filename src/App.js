import React from 'react';
import { Container } from 'react-bootstrap';
import { WeatherProvider } from './contexts/WeatherContext';
import SearchForm from './components/SearchForm';
import WeatherCard from './components/WeatherCard';
import ErrorMessage from './components/ErrorMessage';

function App() {
  return (
    <WeatherProvider>
      <Container className="mt-4">
        <h1>Consulta do Clima</h1>
        <SearchForm />
        <ErrorMessage />
        <WeatherCard />
      </Container>
    </WeatherProvider>
  );
}

export default App;
