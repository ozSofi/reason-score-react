import ReasonScore from './ReasonScore';


class Data {
  constructor(setState, topClaimId) {
    this.setState = setState;
    this.topClaimId = topClaimId;

    this.data = {
      items: {
        qVW5afkgWU4M: { id: 'qVW5afkgWU4M', type: 'claim', content: 'Tabs are better than spaces', ver: 'qVW5zS9hcEL2', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
        qVWqGQPwOnfP: { id: 'qVWqGQPwOnfP', type: 'claim', content: 'Tabs require fewer characters', ver: 'qVWwiw4JMmSJ', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
        qVWwNH61JLpe: { id: 'qVWwNH61JLpe', type: 'argument', parent: 'qVW5afkgWU4M', child: 'qVWqGQPwOnfP', scope: 'qVW5afkgWU4M', pro: true, affects: 'truth', trans: 'qVW5zS9hcELl', ver: 'qVW5zS9hcEL2', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
      }
    };

    this.state = {
      vm: this.buildViewModel(this.topClaimId, this.topClaimId, []),
      data: this.data
    };

    //Set up singleton transaction processor
    if (!window.ReasonScoreTransactionProcessors) {
      window.ReasonScoreTransactionProcessors = [];
    }
    window.ReasonScoreTransactionProcessors.push(this.processTransaction.bind(this))
  }

  updateState() {
    this.setState({
      vm: this.buildViewModel(this.topClaimId, this.topClaimId, [])
    });
  }

  getChildEdges(parent, ancestors) {
    return Object.values(this.data.items).filter(edge =>
      edge.parent === parent
      && !edge.history
      && (ancestors.includes(edge.scope)
        || edge.scope === parent))
  }

  buildViewModel(topId, parentClaimId, ancestors, conTop) {
    const childArguments = this.getChildEdges(parentClaimId, ancestors);
    const childVms = [];
    const childScores = [];

    childArguments.forEach((argument) => {
      const childAncestors = ancestors.slice();
      childAncestors.push(parentClaimId);
      const childVm = this.buildViewModel(topId, argument.child, childAncestors,
        argument.pro? conTop : !conTop);
      childVm.argument = argument;
      childVms.push(childVm);
    });

    const vm = {
      id: '',
      topId,
      childId: parentClaimId,
      children: [],
    };

    vm.id = ancestors.join('/');
    if (vm.id.length > 0) {
      vm.id += '/';
    }
    vm.id += parentClaimId;

    childVms.forEach((childContext) => {
      childScores.push(childContext.score);
      vm.children.push({
        id: childContext.id,
        childId: childContext.childId,
      });
    });

    //add everything in
    vm.children = childVms;
    vm.conTop = conTop;
    vm.className = 'claim'+ (vm.conTop? ' con':' pro');
    vm.claim = this.data.items[parentClaimId];
    vm.score = ReasonScore.calculateReasonScore(parentClaimId, childArguments, childScores);
    vm.content = vm.claim.content;
    vm.display = vm.score.display;
    if (this.selectedVm && vm.id === this.selectedVm.id) {
      vm.selected = true
      vm.unSelect = () => this.onSelect();
    } else {
      vm.onSelect = () => this.onSelect(vm);
    }
    vm.sendTransaction = this.sendTransaction.bind(this);
    return vm;
  }

  sendTransaction(transaction) {
    for (const processTransaction of window.ReasonScoreTransactionProcessors) {
      processTransaction(transaction)
    }
  }

  processTransaction(transaction) {
    const transId = this.newId();
    const items = this.data.items;
    for (const action of transaction) {
      action.ver = this.newId();
      action.type = 'act'
      action.trans = transId;
      items[action.id] = { ...items[action.id], ...action.new, ver: action.ver, mod: new Date() };
      items[action.ver] = action;
      this.updateState();
    }
  }

  onSelect(vm) {
    this.selectedVm = vm;
    this.setState({
      vm: this.buildViewModel(this.topClaimId, this.topClaimId, [])
    });
  }

  newId() {
    // take the current UTC date and convert to base 62
    let decimal = new Date();
    const s = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let result = '';
    while (decimal >= 1) {
      result = s[(decimal - (62 * Math.floor(decimal / 62)))] + result;
      decimal = Math.floor(decimal / 62);
    }

    // Add 5 extra random characters in case multiple ids are creates at the same time
    result += Array(5).join().split(',').map(() => s[(Math.floor(Math.random() * s.length))])
      .join('');

    return result;
  }
}

export default Data;
