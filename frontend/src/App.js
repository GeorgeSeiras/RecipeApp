import React from 'react';
import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { authRoutes, publicRoutes, privateRoutes, } from './routes';
import { AuthProvider } from './components/Context';
import { PrivateRoute, NoLoggedInRoute } from './components/CustomRoutes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              exact path={route.path}
              element={<PrivateRoute>{route.element}</PrivateRoute>}
            />
          ))}
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              exact path={route.path}
              element={route.element}
            />
          ))}
          {authRoutes.map((route) => (
            <Route
              key={route.path}
              exact path={route.path}
              element={<NoLoggedInRoute>{route.element}</NoLoggedInRoute>}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
