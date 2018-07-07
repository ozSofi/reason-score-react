import React from 'react';

function History(props) {
    // const items = Object.values(props.data.items).filter(item =>
    //     item.type === 'act').reverse();
    var whens = Object.values(props.data.items).reduce(function (uniqueWhens, node) {
        if (!uniqueWhens.includes(node.start)) {
            uniqueWhens.push(node.start);
        }
        return uniqueWhens;
    }, []);


    return (
        <div className='history'>
            {whens.map((history) => (
                <div key={history}>{history}</div>
            ))}
        </div>
    );
}

export default History;