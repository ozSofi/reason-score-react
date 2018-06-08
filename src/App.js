import React, { Component } from 'react';
import './App.css';

function Claim(props) {
  return (
    <div>{props.claimData.claim.content}
      {props.claimData.renderChildren()}
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
          { id: "main", open: true }
        ]
      }
    };
  }

  getClaimView(claim) {
    let claimView = this.state.viewState.claims.filter(c => c.id === claim.id)[0];
    if (claimView === undefined) {
      claimView = {}
    }
    return claimView;
  }

  getClaimData(id) {
    const claim = this.state.claims.filter(claim => claim.id === id)[0]

    const claimData = {
      claim: claim,
      claimView: this.getClaimView(claim)
    }

    claimData.renderChildren = () => this.renderChildren(claimData);

    return claimData;
  }

  renderChildren(parentClaimData) {
    const parentClaim = parentClaimData.claim;
    const childEdges = this.state.edges.filter(edge => edge.parentId === parentClaim.id);
    const parentClaimView = this.getClaimView(parentClaim);
    if (childEdges.length > 0
      && parentClaimView.open
    ) {
      const renderedChildren = childEdges.map((edge, step) => {
        const childData = this.getClaimData(edge.childId);
        return (
          <li key={childData.claim.id}>
            {this.renderClaim(childData)}
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

  renderClaim(claimData) {
    return (
      <Claim
        claimData={claimData}
      />
    );
  }

  render() {
    const claimData = this.getClaimData(this.state.rootClaim.id)
    return (
      <div className="App">
        {this.renderClaim(claimData)}
      </div>
    );
  }
}

export default App;
