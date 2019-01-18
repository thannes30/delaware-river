import React, { Component } from 'react';
import '../App.css';
import Header from './Header';
import LocationsMap from './LocationsMap';
import RiverConditions from './RiverConditions';
import Footer from './Footer';
import { Switch, Route } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <div className="app-wrapper">
        <Header />
        <Switch>
          <Route exact path='/' component={LocationsMap} />
          <Route exact path='/:place' component={RiverConditions} />
        </Switch>
        <Footer />
      </div>
    );
  }

}

export default App;
