import React from 'react';
import Editor from './Editor';
import { Collapse } from 'react-bootstrap';

function Claim(props) {
    const vm = props.vm;
    return (
        <div className={vm.className}>
            <span onClick={vm.onSelect}>
                {vm.display} &nbsp;
                {vm.content}
            </span>
            <Collapse in={vm.selected} mountOnEnter={true}>
                <div>
                    <Editor vm={vm} />
                </div>
            </Collapse>
            
            <Collapse in={vm.children.length > 0} mountOnEnter={true}>
                    <ul>
                        {vm.children.map((child) => (
                            <Claim key={child.argument.ver}  vm={child} />
                        ))}
                    </ul>
            </Collapse>
        </div>
    );
}

export default Claim;