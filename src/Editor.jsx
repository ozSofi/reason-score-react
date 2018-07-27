import React, { Component } from 'react';


class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      claim: { ...props.vm.claim }
    };
    if (props.vm.argument) {
      this.state.argument = { ...props.vm.argument };
    }
    this.vm = props.vm;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(event) {
    const dest = event.target.id.split(".");
    const newState = {};
    newState[dest[0]] = { ...this.state[dest[0]] };
    newState[dest[0]][dest[1]] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState(newState);
  }

  handleSubmit(event) {
    event.preventDefault();
    const transaction = []
    if (this.vm.argument) {
      transaction.push({
        id: this.vm.argument.id,
        act: 'update',
        new: this.state.argument,
        old: this.vm.argument
      });

    }
    transaction.push({
      id: this.vm.claim.id,
      act: 'update',
      new: this.state.claim,
      old: this.vm.claim
    });
    this.vm.sendTransaction(transaction);
    this.vm.unSelect();
  }

  handleCancel() {
    this.vm.unSelect();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ padding: '10px' }}>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <input type="text" className="form-control" id="claim.content" value={this.state.claim.content} onChange={this.handleChange} />
        </div>
        {this.state.argument &&
          <div >
            <label>
              <input type="checkbox" id="argument.pro" checked={this.state.argument.pro} onChange={this.handleChange} /> Pro Parent
            </label>
            <br />
            <label>
              Affects:
              <select id="argument.affects" value={this.state.argument.affects} onChange={this.handleChange}>
                <option value="truth">truth</option>
                <option value="relevance">relevance</option>
              </select>
            </label>
          </div>
        }
        <button type="submit" value="Submit" className="btn btn-default">Submit</button>
        <button type="button" value="Cancel" className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
      </form>
    );
  }
}

export default Editor;