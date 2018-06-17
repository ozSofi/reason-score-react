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
    this.state = {
      rootClaimId: "1",
      claims: [
        { id: "1", content: "Claim 1" },
        { id: "1.1", content: "Claim 1.1" },
        { id: "1.2", content: "Claim 1.2" },
        { id: "1.1.1", content: "Claim 1.1.1" },
        { id: "1.1.2", content: "Claim 1.1.2" },
        { id: "2", content: "Claim 2" }
      ],
      edges: [
        { parentId: "1", childId: "1.1", align: "pro", contextId: "1.1"}
        , { parentId: "1", childId: "1.2", align: "con", contextId: "1.2"}
        , { parentId: "2", childId: "1.1", align: "con", contextId: "1.1"}
        , { parentId: "1.1", childId: "1.1.1", align: "pro", contextId: "1"}
        , { parentId: "1.1", childId: "1.1.2", align: "pro", contextId: "2"}
      ],
      viewState: {
        claims: [
          { id: "1", open: true },
          { id: "2", open: true },
          { id: "1.1", open: true }
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
      claimView: this.getClaimView(claim),
      ancestors: []
    }

    claimData.renderChildren = () => this.renderChildren(claimData);

    return claimData;
  }

  renderChildren(parentClaimData) {
    const parentClaim = parentClaimData.claim;
    const childEdges = this.state.edges.filter(edge => edge.parentId === parentClaim.id
      && (parentClaimData.ancestors.includes(edge.contextId)
        || edge.contextId == edge.childId)
    );
    const parentClaimView = this.getClaimView(parentClaim);
    if (childEdges.length > 0
      && parentClaimView.open
    ) {
      const renderedChildren = childEdges.map((edge, step) => {
        const childData = this.getClaimData(edge.childId);
        childData.ancestors = parentClaimData.ancestors.slice();
        childData.ancestors.push(parentClaim.id);
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
    const claimData = this.getClaimData(this.props.claimId)
    return (
      <div className="App">
        {this.renderClaim(claimData)}
      </div>
    );
  }
}

export default App;
