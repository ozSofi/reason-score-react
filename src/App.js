import React, { Component } from 'react';
import './App.css';
import data from './data';
import Claim from './Claim';
import History from './History';
import ViewModelBuilder from './ViewModelBuilder';

class App extends Component {
  constructor(props) {
    super(props);
    this.ViewModelBuilder = new ViewModelBuilder(this.setState.bind(this), props.claimId);
    this.state = this.ViewModelBuilder.state;
  }

  render() {
    return (
      <div>
        <Claim class="debate" vm={this.state.vm} />
        <History state={this.state} data ={this.ViewModelBuilder.data} vmb={this.ViewModelBuilder}/>
      </div>
    )
  }
}

export default App;
