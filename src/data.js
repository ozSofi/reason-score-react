import ReasonScore from './ReasonScore';


class Data {
  constructor(setState) {
    this.setState = setState;
    this.topClaimId = 'qVW5afkgWU4M';

    this.data = {
      items: {
        qVW5afkgWU4M: { id: 'qVW5afkgWU4M', type: 'claim', content: 'Tabs are better than spaces', ver: 'qVW5zS9hcEL2', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
        qVWqGQPwOnfP: { id: 'qVWqGQPwOnfP', type: 'claim', content: 'Tabs require fewer characters', ver: 'qVWwiw4JMmSJ', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
        qVWwNH61JLpe: { id: 'qVWwNH61JLpe', type: 'argument', parent: 'qVW5afkgWU4M', child: 'qVWqGQPwOnfP', scope: 'qVW5afkgWU4M', pro: true, affects: 'truth', trans: 'qVW5zS9hcELl', ver: 'qVW5zS9hcEL2', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
        qVW5zS9hcEL2: { id: 'qVW5afkgWU4M', history: true, type: 'claim', content: 'Tabs are better than spaces', trans: 'qVW5zS9hcELl', ver: 'qVW5zS9hcEL2', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
        qVWwiw4JMmSJ: { id: 'qVWqGQPwOnfP', history: true, type: 'claim', content: 'Tabs require fewer characters', trans: 'qVW5zS9hcELl', ver: 'qVWwiw4JMmSJ', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
        qVWxPcNXnDU5: { id: 'qVWwNH61JLpe', history: true, type: 'argument', parent: 'qVW5afkgWU4M', child: 'qVWqGQPwOnfP', scope: 'qVW5afkgWU4M', pro: true, affects: 'truth', trans: 'qVW5zS9hcELl', ver: 'qVWxPcNXnDU5', created: '2018-06-24T23:46:48.159Z', mod: '2018-06-24T23:46:48.159Z' },
      }
    };

    this.state = {
      vm: this.buildViewModel(this.topClaimId, this.topClaimId, []),
      data: this.data
    };
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

  buildViewModel(topId, parentClaimId, ancestors) {
    const childEdges = this.getChildEdges(parentClaimId, ancestors);
    const childVms = [];
    const childScores = [];

    childEdges.forEach((edge) => {
      const childAncestors = ancestors.slice();
      childAncestors.push(parentClaimId);
      childVms.push(this.buildViewModel(topId, edge.child, childAncestors));
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
    vm.claim = this.data.items[parentClaimId];
    vm.score = ReasonScore.calculateReasonScore(parentClaimId, childEdges, childScores);
    vm.content = vm.claim.content;
    vm.display = vm.score.display;
    vm.onClick = () => this.onClick(vm);
    return vm;
  }

  processTransaction(transactions) {
    const transId = this.newId();
    const items = this.data.items;
    for (const trans of transactions) {
      trans.ver = this.newId();
      trans.type = 'act'
      trans.trans = transId;
      items[trans.id] = { ...items[trans.id], ...trans.new, ver: trans.ver, mod: new Date() };
      items[trans.ver] = trans;
      this.updateState();
    }
  }

  onClick(vm) {
    const trans = {
      id: vm.claim.id,
      act: 'update',
      new: { content: 'Updated Text' },
      old: vm.claim
    }

    this.processTransaction([trans]);
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
