
class Data {
  constructor(topClaimId, notifyCallback) {
    this.topClaimId = topClaimId;
    this.when = new Date();
    this.notify = notifyCallback;
    this.data = {
      items: {
        qVW5zS9hcEL2: { id: 'qVW5afkgWU4M', type: 'claim', content: 'Tabs are better than spaces', trans: 'qVW5zS9hcELl', ver: 'qVW5zS9hcEL2', start: '2018-06-24T23:46:48.159Z', end: '3000-01-01T00:00:00.000Z' },
        qVWwiw4JMmSJ: { id: 'qVWqGQPwOnfP', type: 'claim', content: 'Tabs require fewer characters', trans: 'qVW5zS9hcELl', ver: 'qVWwiw4JMmSJ', start: '2018-06-24T23:46:48.159Z', end: '3000-01-01T00:00:00.000Z' },
        qVW5zS9hcEL3: { id: 'qVWwNH61JLpe', type: 'argument', parent: 'qVW5afkgWU4M', child: 'qVWqGQPwOnfP', scope: 'qVW5afkgWU4M', pro: true, affects: 'truth', trans: 'qVW5zS9hcELl', ver: 'qVW5zS9hcEL3', start: '2018-06-24T23:46:48.159Z', end: '3000-01-01T00:00:00.000Z' },
      }
    };

    //Set up singleton transaction processor
    if (!window.ReasonScoreTransactionProcessors) {
      window.ReasonScoreTransactionProcessors = [];
    }
    window.ReasonScoreTransactionProcessors.push(this.processTransaction.bind(this))
  }

  notify() {
    this.notify();
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

  getArguments(parent, ancestors, when) {
    return Object.values(this.data.items).filter(edge =>
      edge.parent === parent
      && new Date(edge.start) <= this.when
      && new Date(edge.end) > this.when
      && (ancestors.includes(edge.scope)
        || edge.scope === parent))
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
      this.notify();
    }
  }

  newId() {
    // take the current UTC date and convert to base 62
    let decimal = 5000000000000 - new Date();
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
