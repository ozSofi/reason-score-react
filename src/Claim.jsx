import React from 'react';
import Editor from './Editor';

function Claim(props) {
    const vm = props.vm;
    return (
        <div className='claim'>
            <span onClick={vm.onSelect}>
                {vm.display} &nbsp;
                {vm.content}
            </span>

            {vm.selected &&
                <Editor vm={vm} />
            }

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