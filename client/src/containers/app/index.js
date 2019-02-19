import React from 'react';
import { Route, Link } from 'react-router-dom';
import Admin from '../admin';
import Canvas from '../prompts/canvas';

const App = () => (
  <div>
    <header>
      <Link to="/admin">Admin</Link>
      <Link to="/canvas">Admin</Link>
    </header>

    <main>
      <Route exact path="/admin" component={Admin}></Route> 
      <Route exact path="/canvas" component={Canvas}></Route> 
    </main>
  </div>
);

export default App;
