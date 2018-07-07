import ReasonScore from './ReasonScore';


class Data {
  constructor(setState, topClaimId) {
    this.setState = setState;
    this.topClaimId = topClaimId;
    this.when = new Date();

    this.data = {
      items: {
        qVW5zS9hcEL2: { id: 'qVW5afkgWU4M', type: 'claim', content: 'Tabs are better than spaces', trans: 'qVW5zS9hcELl', ver: 'qVW5zS9hcEL2', start: '2018-06-24T23:46:48.159Z', end: '3000-01-01T00:00:00.000Z' },
        qVWwiw4JMmSJ: { id: 'qVWqGQPwOnfP', type: 'claim', content: 'Tabs require fewer characters', trans: 'qVW5zS9hcELl', ver: 'qVWwiw4JMmSJ', start: '2018-06-24T23:46:48.159Z', end: '3000-01-01T00:00:00.000Z' },
        qVW5zS9hcEL3: { id: 'qVWwNH61JLpe', type: 'argument', parent: 'qVW5afkgWU4M', child: 'qVWqGQPwOnfP', scope: 'qVW5afkgWU4M', pro: true, affects: 'truth', trans: 'qVW5zS9hcELl', ver: 'qVW5zS9hcEL3', start: '2018-06-24T23:46:48.159Z', end: '3000-01-01T00:00:00.000Z' },
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

  getClaim(claimId) {
    const claims = Object.values(this.data.items).filter(claim =>
      claim.id === claimId
      && new Date(claim.start) <= this.when
      && new Date(claim.end) > this.when
    )

    if (claims.length < 1) { debugger; }

    return claims[0];
  }


  getChildEdges(parent, ancestors, when) {
    return Object.values(this.data.items).filter(edge =>
      edge.parent === parent
      && new Date(edge.start) <= this.when
      && new Date(edge.end) > this.when
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
        argument.pro ? conTop : !conTop);
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
    vm.className = 'claim' + (vm.conTop ? ' con' : ' pro');
    vm.claim = this.getClaim(parentClaimId);
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
    transaction.Id = this.newId();
    transaction.start = new Date().toJSON();
    transaction.end = "3000-01-01T00:00:00.000Z";
    for (const action of transaction) {
      action.ver = this.newId();
      action.trans = transaction.id;
    };

    for (const processTransaction of window.ReasonScoreTransactionProcessors) {
      processTransaction(transaction)
    }
  }

  processTransaction(transaction) {
      const items = this.data.items;

    for (const action of transaction) {
      items[action.ver] = { ...action.old, ...action.new, ver: action.ver, start: transaction.start, end: transaction.end };
      items[action.old.ver] = { ...action.old, end: transaction.start }
      this.when = new Date(transaction.start);
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
