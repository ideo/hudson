import React from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import Admin from '../admin';
import Canvas from '../prompts/canvas';

const App = () => (
  <div>
    <header>
      <NavLink 
        to="/admin"
        activeClassName="nav-active">
        Admin
      </NavLink>
      <NavLink
        to="/canvas"
        activeClassName="nav-active">
        Canvas
      </NavLink>
    </header>

    <main>
      <Switch>
        <Route 
          exact
          activeClassName="nav-active"
          path="/admin"
          component={Admin}>
        </Route> 
        <Route 
          exact
          path="/canvas" 
          component={Canvas}>
        </Route>
      </Switch>
    </main>
  </div>
);

export default App;
