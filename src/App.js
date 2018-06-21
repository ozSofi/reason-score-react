import React, { Component } from 'react';
import './App.css';
import data from './data';

function Claim(props) {
  return (
    <div onClick={() => props.claimViewModel.clicked()}>{props.claimViewModel.contextState.score.display} &nbsp;
      {props.claimViewModel.claim.content}
      {props.claimViewModel.renderChildren()}
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.data = new data(this.setState.bind(this), props.dataConfig);
    this.state = this.data.state;

    // Build ContextState
    const topClaim = this.state.claims.filter(claim => claim.id === this.props.claimId)[0];
    this.data.buildContextState(topClaim.id, topClaim.id, []);

    //Dont forget to remove this
    this.clicked = this.clicked.bind(this);
  }

  getViewModel(contextState) {
    const claim = this.state.claims.filter(c => c.id === contextState.childId)[0];

    const claimViewModel = {
      claim,
      children: contextState.children,
      contextState,
    };

    claimViewModel.renderChildren = () => this.renderChildren(contextState);
    claimViewModel.clicked = () => this.clicked(claim.id);
    return claimViewModel;
  }

  renderChildren(parentContextState) {
    if (parentContextState.children.length > 0
    ) {
      const renderedChildren = parentContextState.children.map((child) => {
        const childContext = this.state.contextStates.filter(cs => cs.id === child.id)[0];
        const childViewModel = this.getViewModel(childContext);
        return (
          <li key={childViewModel.claim.id}>
            {this.renderClaim(childViewModel)}
          </li>
        );
      });
      return (
        <ul className="rsChildrenContainer">
          {renderedChildren}
        </ul>
      );
    }
    return (null);
  }

  renderClaim(claimViewModel) {
    return (
      <Claim
        claimViewModel={claimViewModel}
      />
    );
  }

  //Dont forget to remove this
  clicked(id) {
    const transaction = {
      claims: [
        { id: "1", content: "*************** test Update success 1 *****************" },
        { id: id, content: "updated" }
      ]
    }

    this.data.saveTransaction(transaction);
  }


  render() {
    const claim = this.state.contextStates.filter(cs => cs.id === this.props.claimId)[0];
    const claimViewModel = this.getViewModel(claim);
    return (
      <div className="App">
        {this.renderClaim(claimViewModel)}
        <button onClick={this.clicked}>
          test
        </button>
      </div>
    );
  }
}

export default App;
