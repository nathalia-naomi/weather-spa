import React from 'react';
import SearchForm from '../components/SearchForm';
import ErrorMessage from '../components/ErrorMessage';
import WeatherCard from '../components/WeatherCard';
import FavoriteList from '../components/FavoriteList';
import SearchHistory from '../components/SearchHistory';

export default function Dashboard() {
  return (
    <>
      <h1>Consulta do Clima</h1>
      <SearchForm />
      <ErrorMessage />
      <WeatherCard />
      <FavoriteList />
      <SearchHistory />
    </>
  );
}
