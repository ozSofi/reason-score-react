import React from 'react';
import Editor from './Editor';
import { CSSTransitionGroup } from 'react-transition-group';

function Claim(props) {
    const vm = props.vm;
    return (
        <div className={vm.className}>
            <button onClick={vm.increase}>
                +
            </button>
            <button onClick={vm.decrease}>
                -
            </button>
            <span onClick={vm.onSelect}>
                {vm.display} &nbsp;
                {vm.content}
            </span>
            {vm.selected &&
                <Editor vm={vm} />
            }

            {vm.children.length > 0 &&
                <ul>
                    <CSSTransitionGroup
                        transitionName="animate-add-remove"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {vm.children.map((child) => (
                            <Claim key={child.argument.ver} vm={child} />
                        ))}
                    </CSSTransitionGroup>

                </ul>
            }
        </div>
    );
}

export default Claim;