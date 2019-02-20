import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import Admin from '../admin';
import Canvas from '../prompts/canvas';

const App = () => (
  <div>
    <header>
      <NavLink to="/admin">Admin</NavLink>
      <NavLink to="/canvas">Canvas</NavLink>
    </header>

    <main>
      <Route exact path="/admin" component={Admin}></Route> 
      <Route exact path="/canvas" component={Canvas}></Route> 
    </main>
  </div>
);

export default App;
