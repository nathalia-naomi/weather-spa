import React, { useRef, useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import WeatherContext from '../contexts/WeatherContext';
import * as yup from 'yup';

const schema = yup.object().shape({
  city: yup.string().required('Cidade é obrigatória'),
});

export default function SearchForm() {
  const inputRef = useRef();
  const { dispatch } = useContext(WeatherContext);
  const [validationError, setValidationError] = useState('');

  const handleSearch = async () => {
    const city = inputRef.current.value;

    try {
      await schema.validate({ city });
      dispatch({ type: 'LOADING' });

      const API_URL = 'http://api.weatherstack.com/current';
      const API_KEY = process.env.REACT_APP_WEATHERSTACK_API_KEY;
      const res = await fetch(`${API_URL}?access_key=${API_KEY}&query=${city}`);
      const data = await res.json();

      if (data.error) {
        dispatch({ type: 'ERROR', payload: data.error.info });
      } else {
        dispatch({ type: 'SUCCESS', payload: data });
      }

      setValidationError('');
    } catch (err) {
      setValidationError(err.message);
      dispatch({ type: 'ERROR', payload: '' });
    }
  };

  return (
    <>
      <Form.Group>
        <Form.Label>Cidade</Form.Label>
        <Form.Control ref={inputRef} type="text" placeholder="Digite a cidade" />
      </Form.Group>
      {validationError && <p className="text-danger">{validationError}</p>}
      <Button onClick={handleSearch} className="mt-2">Buscar</Button>
    </>
  );
}
