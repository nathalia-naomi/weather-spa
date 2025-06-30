import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
	const { user } = useContext(AuthContext);
	const [favorites, setFavorites] = useState([]);
	const API = process.env.REACT_APP_API_URL;

	const fetchFavorites = async () => {
		if (!user) return;
		const res = await fetch(`${API}/weather/favorite`, {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});
		const data = await res.json();
		setFavorites(data);
	};

	const addFavorite = async (entry) => {
		await fetch(`${API}/weather/favorite`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
			body: JSON.stringify(entry),
		});
		await fetchFavorites();
	};

	const removeFavorite = async (city) => {
		await fetch(`${API}/weather/favorite/${encodeURIComponent(city)}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});
		await fetchFavorites();
	};

	const refreshFavorite = async (city) => {
		try {
			await fetch(`${API}/weather/favorite/${encodeURIComponent(city)}/refresh`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			await fetchFavorites();
		} catch (err) {
			console.error('Erro ao atualizar favorito', err);
		}
	};

	useEffect(() => {
		fetchFavorites();
	}, [user]);

	return <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, refreshFavorite }}>{children}</FavoriteContext.Provider>;
};
