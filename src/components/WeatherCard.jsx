import React, { useContext } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import WeatherContext from '../contexts/WeatherContext';

export default function WeatherCard() {
  const { state } = useContext(WeatherContext);

  if (state.loading) return <Spinner animation="border" />;
  if (!state.weather) return null;

  const { location, current } = state.weather;

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>{location.name}, {location.country}</Card.Title>
        <Card.Text>Temperatura: {current.temperature}°C</Card.Text>
        <Card.Text>Condição: {current.weather_descriptions[0]}</Card.Text>
        <Card.Img src={current.weather_icons[0]} style={{ width: 64 }} />
      </Card.Body>
    </Card>
  );
}
