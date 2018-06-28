import React, { Component } from 'react';
import './App.css';
import data from './data';
import Claim from './Claim';
import History from './History';

class App extends Component {
  constructor(props) {
    super(props);
    this.data = new data(this.setState.bind(this), props.dataConfig);
    this.state = this.data.state;
  }

  render() {
    return (
      <div>
        <Claim class="debate" vm={this.state.vm} />
        <History data={this.state.data} />
      </div>
    )
  }
}

export default App;
