import React, { useEffect, useState, useContext } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { HistoryContext } from '../contexts/HistoryContext';

export default function SearchHistory() {
  const { user } = useContext(AuthContext);
  const { history, setHistory } = useContext(HistoryContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/weather/history`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao buscar histórico');
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, API, setHistory]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (history.length === 0) return <p>Nenhuma busca realizada ainda.</p>;

  return (
    <>
      <h2 className="mt-4">Histórico de Buscas</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cidade</th>
            <th>Temperatura (°C)</th>
            <th>Condição</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id}>
              <td>{new Date(entry.created_at).toLocaleString()}</td>
              <td>{entry.city}</td>
              <td>{entry.temperature}</td>
              <td>{entry.condition}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
