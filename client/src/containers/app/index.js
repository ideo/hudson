import React from 'react';
import { Route, Link } from 'react-router-dom';
import Admin from '../admin';

const App = () => (
  <div>
    <header>
      <Link to="/admin">Admin</Link>
    </header>

    <main>
      <Route exact path="/admin" component={Admin}></Route> 
    </main>
  </div>
);

export default App;
