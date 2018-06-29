import React from 'react';

function History(props) {
    const items = Object.values(props.data.items).filter(item =>
        item.type === 'act').reverse();
    return (
        <div className='history'>
            {items.map((history) => (
                <div key={history.ver}>{history.ver}</div>
            ))}
        </div>
    );
}

export default History;