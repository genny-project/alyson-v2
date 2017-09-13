import './home.scss';
import React, { Component } from 'react';
import { Input } from 'views/generic';

class Home extends Component {
  render() {
    return (
      <div className="home">
        Home
        <Input type="text" />
        <Input type="radio" />
      </div>
    );
  }
}

export default Home;
