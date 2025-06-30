import React, { useContext } from 'react';
import { Card, Spinner, Button } from 'react-bootstrap';
import WeatherContext from '../contexts/WeatherContext';
import { FavoriteContext } from '../contexts/FavoriteContext';

export default React.memo(function WeatherCard() {
  const { state } = useContext(WeatherContext);
  const { addFavorite } = useContext(FavoriteContext);

  if (state.loading) return <Spinner animation="border" />;
  if (!state.weather) return null;

  const { location, current } = state.weather;

  const handleFavorite = () => {
    addFavorite({
      city: location.name,
      temperature: current.temperature,
      condition: current.weather_descriptions[0],
    });
  };

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>{location.name}, {location.country}</Card.Title>
        <Card.Text>Temperatura: {current.temperature}°C</Card.Text>
        <Card.Text>Condição: {current.weather_descriptions[0]}</Card.Text>
        <Card.Img src={current.weather_icons[0]} style={{ width: 64 }} />
        <Button variant="warning" className="mt-3" onClick={handleFavorite}>
          Salvar como favorito
        </Button>
      </Card.Body>
    </Card>
  );
});
