import React from 'react';

function Claim(props) {
    const vm = props.vm;
    return (
        <div className='claim'>
            <span onClick={vm.onClick}>
                {vm.display} &nbsp;
                {vm.content}
            </span>
            {vm.children &&
                <ul>
                    {vm.children.map((child) => (
                        <Claim key={child.id} vm={child} />
                    ))}
                </ul>
            }
        </div>
    );
}

export default Claim;