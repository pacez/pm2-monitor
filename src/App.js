import React from 'react';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import { BackTop } from 'antd';
import { BrowserRouter, Route } from "react-router-dom";
import './App.scss';

const App = () => (
  <div className="App" >
    <BrowserRouter>
      <Route path="/" exact={true} component={Home} />
      <Route path="/login" component={LoginPage} />
    </BrowserRouter>
    <BackTop
      visibilityHeight={50}
    />
  </div>
)

export default App;