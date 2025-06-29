import React, { useRef, useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import WeatherContext from '../contexts/WeatherContext';
import { AuthContext } from '../contexts/AuthContext';
import * as yup from 'yup';
import { HistoryContext } from '../contexts/HistoryContext';

const schema = yup.object().shape({
	city: yup.string().required('Cidade é obrigatória'),
});

export default function SearchForm() {
	const inputRef = useRef();
	const { dispatch } = useContext(WeatherContext);
	const { user } = useContext(AuthContext);
	const { setHistory } = useContext(HistoryContext);

	const [validationError, setValidationError] = useState('');
	const API = process.env.REACT_APP_API_URL;

	const handleSearch = async () => {
		const city = inputRef.current.value;

		try {
			await schema.validate({ city });
			dispatch({ type: 'LOADING' });

			const res = await fetch(`${API}/weather/search?city=${city}`, {
				headers: {
					Authorization: `Bearer ${user?.token}`,
				},
			});

			const data = await res.json();

			if (data.error) {
				dispatch({ type: 'ERROR', payload: data.error.info });
			} else {
				dispatch({ type: 'SUCCESS', payload: data });

				const historyRes = await fetch(`${API}/weather/history`, {
					headers: { Authorization: `Bearer ${user.token}` },
				});
				const updatedHistory = await historyRes.json();
				setHistory(updatedHistory);
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
				<Form.Control ref={inputRef} type='text' placeholder='Digite a cidade' />
			</Form.Group>
			{validationError && <p className='text-danger'>{validationError}</p>}
			<Button onClick={handleSearch} className='mt-2'>
				Buscar
			</Button>
		</>
	);
}
