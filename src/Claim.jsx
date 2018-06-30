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
                    <well>
                        <Editor vm={vm} />
                    </well>
                </div>
            </Collapse>
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