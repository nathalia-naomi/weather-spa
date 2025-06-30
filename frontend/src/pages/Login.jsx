import { useContext, useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials.username, credentials.password);
    if (success) {
      navigate('/');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: 400 }} className="p-4 shadow-sm">
        <h3 className="text-center mb-3">Login</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Usuário</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Digite seu usuário"
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Entrar
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
