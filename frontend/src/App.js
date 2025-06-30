import React, { Suspense, lazy, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { WeatherProvider } from './contexts/WeatherContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import { HistoryProvider } from './contexts/HistoryContext';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Suspense fallback={<div className="text-center mt-5">Carregando...</div>}>
      <AuthContext.Consumer>
        {({ user }) => (
          <BrowserRouter>
            <WeatherProvider>
              <FavoriteProvider>
                <HistoryProvider>
                  <Container className="mt-4">
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Container>
                </HistoryProvider>
              </FavoriteProvider>
            </WeatherProvider>
          </BrowserRouter>
        )}
      </AuthContext.Consumer>
    </Suspense>
  );
}

export default App;
