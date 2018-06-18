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
        { id: "1", content: "Tabs are better than spaces" },
        { id: "1.1", content: "Tabs require fewer characters" },
        { id: "1.2", content: "Developers that use spaces make more money" },
        { id: "1.1.1", content: "Acme is building small IOT devices so every character counts" },
        { id: "1.2.1", content: "John is looking for a high paying job" },
        { id: "acme", content: "Should Acme standardize on tabs" },
        { id: "john", content: "Should John learn to code with tabs" }
      ],
      edges: [
        { parentId: "1", childId: "1.1", align: "pro", contextId: "1" },
        { parentId: "1", childId: "1.2", align: "con", contextId: "1" },
        { parentId: "1.1", childId: "1.1.1", align: "pro", contextId: "acme" },
        { parentId: "1.2", childId: "1.2.1", align: "con", contextId: "john" },
        { parentId: "acme", childId: "1", align: "pro", contextId: "acme" },
        { parentId: "john", childId: "1", align: "pro", contextId: "john" }
      ]
    };
  }

  getClaimData(id) {
    const claim = this.state.claims.filter(claim => claim.id === id)[0]

    const claimData = {
      claim: claim,
      ancestors: []
    }

    claimData.renderChildren = () => this.renderChildren(claimData);

    return claimData;
  }

  renderChildren(parentClaimData) {
    const parentClaim = parentClaimData.claim;
    const childEdges = this.state.edges.filter(edge => edge.parentId === parentClaim.id
      && (parentClaimData.ancestors.includes(edge.contextId)
        || edge.contextId === parentClaim.id)
    );
    if (childEdges.length > 0
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
