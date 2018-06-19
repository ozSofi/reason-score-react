class ReasonScore {

    static calculateReasonScore(id, childEdges, childScores) {
        const score = {
            id: id,
            relevance: 1,
            strengthTotal: 0,
            weightTotal: 0
        };

        if (childEdges === undefined
            || childEdges.length < 1
            || childEdges.filter(e => e.affects === "truth").length < 1) {
            score.strengthTotal = 1;
            score.weightTotal = 1;
        }

        for (let edge of childEdges) {
            const childScore = childScores.filter(s => s.id === edge.childId)[0];
            //Process Truth child claims
            if (edge.affects === "truth") {
                let weight = 0;
                if (edge.reversable){
                    weight = childScore.score * childScore.relevance;
                } else {
                    weight = Math.max(0, childScore.score) * childScore.relevance;
                }
                score.weightTotal += weight;
                if (edge.pro) {
                    score.strengthTotal += weight * childScore.score;
                } else {
                    score.strengthTotal += weight * -childScore.score;
                }
            }

            //Process Relevance child claims
            if (edge.affects === "relevance") {
                if (edge.pro) {
                    score.relevance *= 1 + childScore.score
                } else {
                    score.relevance *= 1 - (childScore.score / 2)
                }
            }

        }

        if (score.weightTotal === 0) {
            score.score = 0
        } else {
            score.score = score.strengthTotal / score.weightTotal;
        }
        
        return score;
    }
}

export default ReasonScore;