import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from '../src/components/Login/Login';
import Signup from '../src/components/Signup/Signup';

function setToken(token,remember){
  if(remember){
    localStorage.setItem('recipeapptoken',JSON.stringify(token));
  }else{
    sessionStorage.setItem('recipeapptoken',JSON.stringify(token));
  }

}

function getToken(){
  const storageToken = localStorage.getItem('recipeapptoken');
  const sessionToken = sessionStorage.getItem('recipeapptoken');
  if(storageToken){
    const token = JSON.parse(storageToken);
    return token?.access;
  }else{
    const token = JSON.parse(sessionToken);
    return token?.access;
  }

}

function App() {

  const token = getToken();
  if(!token) {
    return <Login setToken={setToken}/>
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login setToken={setToken}/>}/>
          <Route exact path="/register" element={<Signup/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
