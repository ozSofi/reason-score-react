import React, { Component } from 'react';
import './App.css';
import './ReasonScore.js';
import ReasonScore from './ReasonScore.js';

function Claim(props) {
  return (
    <div>{props.claimViewModel.contextState.score.display}  {props.claimViewModel.claim.content}
      {props.claimViewModel.renderChildren()}
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
        { parentId: "1.1", childId: "1.1.1", pro: true, contextId: "acme", affects: "relevance" },
        { parentId: "1.2", childId: "1.2.1", pro: true, contextId: "john", affects: "relevance" },
        { parentId: "acme", childId: "1", pro: true, contextId: "acme", affects: "truth" },
        { parentId: "john", childId: "1", pro: true, contextId: "john", affects: "truth", reversable:true }
      ],
      contextStates: []
    };

    //Build ContextState
    const topClaim = this.state.claims.filter(claim => claim.id === this.props.claimId)[0];
    this.buildContextState(topClaim.id, topClaim.id, []);
    //debugger;
  }

  buildContextState(topId, parentClaimId, ancestors) {
    const childEdges = this.getChildEdges(parentClaimId, ancestors);
    const childContexts = [];
    const childScores = [];

    for (const edge of childEdges) {
      const childAncestors = ancestors.slice();
      childAncestors.push(parentClaimId);
      childContexts.push(this.buildContextState(topId, edge.childId, childAncestors));
    }

    const contextState = {
      id: "",
      topId: topId,
      childId: parentClaimId,
      children: [],
    }

    contextState.id = ancestors.join("/")
    if (contextState.id.length > 0) {
      contextState.id += "/"
    }
    contextState.id += parentClaimId

    for (const childContext of childContexts) {
      childScores.push(childContext.score);
      contextState.children.push({
        id: childContext.id,
        childId: childContext.childId
      });
    }
    this.state.contextStates.push(contextState);

    const score = ReasonScore.calculateReasonScore(parentClaimId, childEdges, childScores)
    contextState.score = score;


    return contextState;
  }

  getViewModel(contextState){
    const claim = this.state.claims.filter(claim => claim.id === contextState.childId)[0];

    const claimViewModel = {
      claim: claim,
      children: contextState.children,
      contextState: contextState
    }

    claimViewModel.renderChildren = () => this.renderChildren(contextState);
    return claimViewModel;
  }

  getChildEdges(parentId, ancestors) {
    return this.state.edges.filter(edge => edge.parentId === parentId
      && (ancestors.includes(edge.contextId)
        || edge.contextId === parentId)
    );
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
      )
    } else {
      return (null);
    }
  }

  renderClaim(claimViewModel) {
    return (
      <Claim
      claimViewModel={claimViewModel}
      />
    );
  }

  render() {
    const claimViewModel = this.getViewModel(this.state.contextStates.filter(cs => cs.id === this.props.claimId)[0])
    return (
      <div className="App">
        {this.renderClaim(claimViewModel)}
      </div>
    );
  }
}

export default App;
