import firebase from 'firebase';
import ReasonScore from './ReasonScore';


class Data {

    constructor(setState, dataConfig) {
        if (dataConfig === undefined) {
            dataConfig = {
                apiKey: "AIzaSyBmu9Lhj9Stp8dhamvCA4oi16o_jU4qnQM",
                authDomain: "reason-score.firebaseapp.com",
                databaseURL: "https://reason-score.firebaseio.com",
                projectId: "reason-score",
                storageBucket: "reason-score.appspot.com",
                messagingSenderId: "403624872089"
            };
        }

        //Firebase singleton
        if (window.firebase === undefined) {
            window.firebase = firebase.initializeApp(dataConfig);
        }

        this.firebase = window.firebase;
        this.setState = setState;

        this.state = {
            claims: [
                { id: '1', content: 'Tabs are better than spaces' },
                { id: '1.1', content: 'Tabs require fewer characters' },
                { id: '1.2', content: 'Developers that use spaces make more money' },
                { id: '1.1.1', content: 'Acme is building small IOT devices so every character counts' },
                { id: '1.2.1', content: 'John is looking for a high paying job' },
                { id: 'acme', content: 'Should Acme standardize on tabs' },
                { id: 'john', content: 'Should John learn to code with tabs' },
            ],
            edges: [
                { id: "a", parentId: '1', childId: '1.1', pro: true, contextId: '1', affects: 'truth' },
                { id: "b", parentId: '1', childId: '1.2', pro: false, contextId: '1', affects: 'truth' },
                { id: "c", parentId: '1.1', childId: '1.1.1', pro: true, contextId: 'acme', affects: 'relevance' },
                { id: "d", parentId: '1.2', childId: '1.2.1', pro: true, contextId: 'john', affects: 'relevance' },
                { id: "e", parentId: 'acme', childId: '1', pro: true, contextId: 'acme', affects: 'truth' },
                { id: "f", parentId: 'john', childId: '1', pro: true, contextId: 'john', affects: 'truth', reversable: true },
            ],
            contextStates: [],
        };
    }

    saveTransaction(transaction) {
        const newState = {};
        Object.keys(transaction).forEach(function (key) {

            const ids = [];
            for (const transactionElement of transaction[key]) {
                ids.push(transactionElement.id);
            }

            const newArray = [];
            for (const element of this.state[key]) {
                if (ids.includes(element.id)) {
                    const transactionElement = transaction[key].filter(te => te.id == element.id)[0];
                    newArray.push(Object.assign(element, transactionElement))
                } else {
                    newArray.push(element);
                }
            }

            newState[key] = newArray;

        }, this);

        this.setState(newState);
    }

    buildContextState(topId, parentClaimId, ancestors) {
        const childEdges = this.getChildEdges(parentClaimId, ancestors);
        const childContexts = [];
        const childScores = [];

        childEdges.forEach((edge) => {
            const childAncestors = ancestors.slice();
            childAncestors.push(parentClaimId);
            childContexts.push(this.buildContextState(topId, edge.childId, childAncestors));
        });

        const contextState = {
            id: '',
            topId,
            childId: parentClaimId,
            children: [],
        };

        contextState.id = ancestors.join('/');
        if (contextState.id.length > 0) {
            contextState.id += '/';
        }
        contextState.id += parentClaimId;

        childContexts.forEach((childContext) => {
            childScores.push(childContext.score);
            contextState.children.push({
                id: childContext.id,
                childId: childContext.childId,
            });
        });
        this.state.contextStates.push(contextState);

        const score = ReasonScore.calculateReasonScore(parentClaimId, childEdges, childScores);
        contextState.score = score;


        return contextState;
    }

    getChildEdges(parentId, ancestors) {
        return this.state.edges.filter(edge => edge.parentId === parentId
            && (ancestors.includes(edge.contextId)
                || edge.contextId === parentId));
    }

}

export default Data;