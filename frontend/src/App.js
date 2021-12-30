import React from 'react';
import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import routes from './routes';
import { AuthProvider } from './components/Context';
import Home from './components/Home/Home';
import Login from './components/Login/Login'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              exact path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
