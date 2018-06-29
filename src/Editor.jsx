import React, { Component } from 'react';


class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {...props.vm.claim};
    this.vm = props.vm;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const newState = {}
    newState[event.target.id] = event.target.value;
    this.setState(newState);
  }

  handleSubmit(event) {
    event.preventDefault();
    
     const transaction = {
       id: this.vm.claim.id,
       act: 'update',
       new: this.state,
       old: this.vm.claim
     }
    this.vm.sendTransaction([transaction]);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <input type="text" className="form-control" id="content" value={this.state.content} onChange={this.handleChange}  />
        </div>
        <div className="checkbox">
          <label>
            <input type="checkbox" id="pro" /> Pro Parent
          </label>
        </div>
        <button type="submit"  value="Submit" className="btn btn-default">Submit</button>
      </form>
    );
  }
}

export default Editor;