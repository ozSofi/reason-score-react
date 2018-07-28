import React from 'react';

function History(props) {
    var whens = Object.values(props.state.data.data.items).reduce(function (uniqueWhens, node) {
        if (!uniqueWhens.includes(node.start)) {
            uniqueWhens.push(node.start);
        }
        return uniqueWhens;
    }, []);

    var onSelect = (history) => {
        props.data.when = new Date(history);
        props.vmb.updateState()
    }

    return (
        <div className='historyConatiner'>
            {whens.map((history) => (
                <div className={'history'}  onClick={onSelect.bind(this,history)} key={history} title={history}></div>
            ))}
        </div>
    );
}

export default History;