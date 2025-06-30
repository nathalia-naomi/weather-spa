import {createContext, useState, useEffect } from "react";
import {jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const API = process.env.REACT_APP_API_URL;
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('user');
        console.log('stored', stored)
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const decoded = jwtDecode(parsed.token);
                const now = Date.now() / 1000;
        console.log('decoded', decoded)
        console.log('decoded.exp', decoded.exp)

                if (decoded.exp && decoded.exp < now) {
                    console.warn('Token expirado');
                    localStorage.removeItem('user');
                    setUser(null);
                } else {
                    setUser(parsed);
                }
            } catch (e) {
                console.warn('Token inválido');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) throw new Error("login failed");
            const data = await response.json();

            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            return true;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }} >
            {children}
        </AuthContext.Provider>
    );
};