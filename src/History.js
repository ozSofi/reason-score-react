import React from 'react';

function History(props) {
    // const items = Object.values(props.data.items).filter(item =>
    //     item.type === 'act').reverse();
    var whens = Object.values(props.state.data.items).reduce(function (uniqueWhens, node) {
        if (!uniqueWhens.includes(node.start)) {
            uniqueWhens.push(node.start);
        }
        return uniqueWhens;
    }, []);

    var onSelect = (history) => {
        props.data.when = new Date(history);
        props.data.updateState()
    }


    return (
        <div className='history'>
            {whens.reverse().map((history) => (
                <div  onClick={onSelect.bind(this,history)} key={history}>{history}</div>
            ))}
        </div>
    );
}

export default History;