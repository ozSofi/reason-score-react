import React from 'react';
import Editor from './Editor';

function Claim(props) {
    const vm = props.vm;
    return (
        <div className={vm.className}>
            <span onClick={vm.increase}>
                +
            </span>
            <span onClick={vm.decrease}>
                -
            </span>
             <span onClick={vm.onSelect}>
                {vm.display} &nbsp;
                {vm.content}
            </span>
            {vm.selected &&
                <Editor vm={vm} />
            }
            
            {vm.children.length > 0 &&
                    <ul>
                        {vm.children.map((child) => (
                            <Claim key={child.argument.ver}  vm={child} />
                        ))}
                    </ul>
            }
        </div>
    );
}

export default Claim;