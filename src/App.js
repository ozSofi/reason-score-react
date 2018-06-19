import React, { Component } from 'react';
import './App.css';
import './ReasonScore.js';
import ReasonScore from './ReasonScore.js';

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
        { parentId: "1", childId: "1.1", pro: true, contextId: "1", affects: "truth" },
        { parentId: "1", childId: "1.2", pro: false, contextId: "1", affects: "truth" },
        { parentId: "1.1", childId: "1.1.1", pro: true, contextId: "acme", affects: "truth" },
        { parentId: "1.2", childId: "1.2.1", pro: false, contextId: "john", affects: "truth" },
        { parentId: "acme", childId: "1", pro: true, contextId: "acme", affects: "relevance" },
        { parentId: "john", childId: "1", pro: true, contextId: "john", affects: "relevance" }
      ],
      contextStates: []
    };

    //Build ContextState
    const topClaim = this.state.claims.filter(claim => claim.id === this.props.claimId)[0];
    this.buildContextState(topClaim.id, topClaim.id, []);
  }

  buildContextState(topId, parentClaimId, ancestors) {
    const childEdges = this.getChildEdges(parentClaimId, ancestors);
    const childContexts = [];

    for (const edge of childEdges) {
      const childAncestors = ancestors.slice();
      childAncestors.push(parentClaimId);
      childContexts.push(this.buildContextState(topId, edge.childId, childAncestors));
    }

    const contextState = {
      id: "",
      topId: topId,
      childId: parentClaimId,
      children: []
    }

    contextState.id = ancestors.join("/")
    if (contextState.id.length > 0) {
      contextState.id += "/"
    }
    contextState.id += parentClaimId

    for (const childContext of childContexts) {
      contextState.children.push({
        id: childContext.id,
        childId: childContext.childId
      });
    }
    this.state.contextStates.push(contextState);
    return contextState;
  }

  getClaimData(id) {
    const claim = this.state.claims.filter(claim => claim.id === id)[0];

    const claimData = {
      claim: claim,
      ancestors: []
    };

    claimData.renderChildren = () => this.renderChildren(claimData);

    return claimData;
  }

  getChildEdges(parentId, ancestors) {
    return this.state.edges.filter(edge => edge.parentId === parentId
      && (ancestors.includes(edge.contextId)
        || edge.contextId === parentId)
    );
  }

  renderChildren(parentClaimData) {
    const parentClaim = parentClaimData.claim;
    const childEdges = this.getChildEdges(parentClaim.id, parentClaimData.ancestors)
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
