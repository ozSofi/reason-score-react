class ReasonScore {
  static calculateReasonScore(id, childEdges, childScores) {
    const score = {
      id,
      relevance: 1,
      strengthTotal: 0,
      weightTotal: 0,
    };

    if (childEdges === undefined
      || childEdges.length < 1
      || childEdges.filter(e => e.affects === 'truth').length < 1) {
      score.strengthTotal = 1;
      score.weightTotal = 1;
    }

    childEdges.forEach((edge) => {
      const childScore = childScores.filter(s => s.id === edge.child)[0];

      // Process Truth child claims
      if (edge.affects === 'truth') {
        if (edge.reversable) {
          childScore.weight = childScore.score * childScore.relevance;
        } else {
          childScore.weight = Math.max(0, childScore.score) * childScore.relevance;
        }
        score.weightTotal += childScore.weight;

        if (edge.pro) {
          childScore.strength = childScore.weight * childScore.score;
        } else {
          childScore.strength = childScore.weight * -childScore.score;
        }

        score.strengthTotal += childScore.strength;

        childScore.display = `${Math.round(childScore.weight * 100) * (edge.pro ? 1 : -1)}%`;
        // childScore.display += " ("
        //     + childScore.strengthTotal.toString().substring(0,4) + ":"
        //     + childScore.weightTotal.toString().substring(0,4) + ":"
        //     + childScore.strength.toString().substring(0,4) + ":"
        //     + childScore.weight.toString().substring(0,4) + ":"
        //     + childScore.relevance.toString().substring(0,4)
        //    + ")";
      }

      // Process Relevance child claims
      if (edge.affects === 'relevance') {
        if (edge.pro) {
          childScore.relevance = 1 + childScore.score;
        } else {
          childScore.relevance = 1 - (childScore.score / 2);
        }
        score.relevance *= childScore.relevance;
        childScore.display = `X${childScore.relevance}`;
      }
    });

    if (score.weightTotal === 0) {
      score.score = 0;
    } else {
      score.score = score.strengthTotal / score.weightTotal;
    }

    score.display = `${Math.round(score.score * 100)}%`;

    return score;
  }
}

export default ReasonScore;
