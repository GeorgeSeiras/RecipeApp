import React from 'react';
import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { authRoutes, publicRoutes, privateRoutes, } from './routes';
import { AuthProvider } from './components/Context/authContext';
import { PrivateRoute, NoLoggedInRoute, NormalRoute } from './components/CustomRoutes'
import Navigation from './components/NavBar/NavBar';
import { ErrorHandler } from './components/ErrorHandler/ErrorHandler';
import Page_404 from './components/404';
import ErrorComp from './components/ErrorHandler/ErrorComp';
import Footer from './components/Footer';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorHandler>
          <Navigation />
          <ErrorComp />
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
                element={<NormalRoute>{route.element}</NormalRoute>}
              />
            ))}
            {authRoutes.map((route) => (
              <Route
                key={route.path}
                exact path={route.path}
                element={<NoLoggedInRoute>{route.element}</NoLoggedInRoute>}
              />
            ))}
            <Route key="*" path="*" element={<Page_404 />} />
          </Routes>
          <Footer />
        </ErrorHandler>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
