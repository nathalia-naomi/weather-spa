import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { WeatherProvider } from './contexts/WeatherContext';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

import SearchForm from './components/SearchForm';
import SearchHistory from './components/SearchHistory';
import WeatherCard from './components/WeatherCard';
import ErrorMessage from './components/ErrorMessage';
import Login from './components/Login';
import { HistoryProvider } from './contexts/HistoryContext';

function MainApp() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Login />;
  }

  return (
    <WeatherProvider>
      <Container className="mt-4">
        <h1>Consulta do Clima</h1>
        <SearchForm />
        <ErrorMessage />
        <WeatherCard />
        <SearchHistory />
      </Container>
    </WeatherProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <MainApp />
      </HistoryProvider>
    </AuthProvider>
  );
}

export default App;
