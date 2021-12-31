import React from 'react';
import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import routes from './routes';
import { AuthProvider } from './components/Context';
import  AppRoute  from './components/AppRoute'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              exact path={route.path}
              element={<AppRoute>{route.element}</AppRoute>}
              isPrivate={route.isPrivate}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
