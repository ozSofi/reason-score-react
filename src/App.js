import React, { Component } from 'react';
import './App.css';

function Claim(props) {
  return (
    <div>{props.claim.content}
      {props.children(props.claim)}
    </div>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    let rootClaim = { id: "main", content: "Main Claim" };
    this.state = {
      rootClaim: rootClaim,
      claims: [
        rootClaim,
        { id: "1", content: "Claim 1" }
        , { id: "2", content: "Claim 2" }
        , { id: "1_1", content: "Claim 1_1" }
        , { id: "1_2", content: "Claim 1_2" }
      ],
      edges: [
        { parentId: "main", childId: "1", align: "pro" }
        , { parentId: "main", childId: "2", align: "con" }
        , { parentId: "1", childId: "1_1", align: "pro" }
        , { parentId: "1", childId: "1_2", align: "con" }
      ],
      viewState: {
        claims: [
          {id: "main", open:true}
        ]
      }
    };
  }

  getClaimView(claim){
    let claimView = this.state.viewState.claims.filter(c => c.id === claim.id)[0];
    if (claimView === undefined){
      claimView = {}
    }
    return claimView;
  }

  getChildEdges(parentClaim){
    return this.state.edges.filter(edge => edge.parentId === parentClaim.id)
  }

  children(parentClaim) {
    const childEdges = this.getChildEdges(parentClaim);
    const parentClaimView = this.getClaimView(parentClaim);
    if (childEdges.length > 0 
        && parentClaimView.open
      ) {
      const renderedChildren = childEdges.map((edge, step) => {
        const child = this.state.claims.filter(claim => claim.id === edge.childId)[0];
        return (
          <li key={child.id}>
            {this.renderClaim(child)}
          </li>
        );
      });
      return (
        <ul className="rsChildrenContainer">
          {renderedChildren}
        </ul>
      )
    } else {
      return (null);
    }
  }

  renderClaim(claim) {
    return (
      <Claim
        claim={claim}
        children={() => this.children(claim)}
      />
    );
  }

  render() {
    return (
      <div className="App">
        {this.renderClaim(this.state.rootClaim)}
      </div>
    );
  }
}

export default App;
