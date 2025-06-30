import React, { useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import { FavoriteContext } from '../contexts/FavoriteContext';

export default React.memo(function FavoriteList({ onSearch }) {
  const { favorites, removeFavorite, refreshFavorite } = useContext(FavoriteContext);

  if (!favorites.length) return null;

  return (
    <>
      <h2 className="mt-4">Buscas Favoritas</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cidade</th>
            <th>Temperatura</th>
            <th>Condição</th>
            <th>Última Atualização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((fav) => (
            <tr key={fav.id}>
              <td>{fav.city}</td>
              <td>{fav.temperature}°C</td>
              <td>{fav.condition}</td>
              <td>{new Date(fav.updated_at).toLocaleString()}</td>
              <td>
                <Button size="sm" onClick={() => refreshFavorite(fav.city)}>Buscar</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => removeFavorite(fav.city)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
});
