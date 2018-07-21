import React from 'react';
import Editor from './Editor';
import { CSSTransitionGroup } from 'react-transition-group';

function Claim(props) {
    const vm = props.vm;
    return (
        <div className={'claim-outer'}>
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
                <div className={'callout'}>
                    <svg viewBox="0 0 5.2917 5.2917">
                        <g transform="translate(0 -291.71)">
                            <path d="m5.2596 296.97c-3.5372
                            0.01-3.8232-1.627-3.7822-2.3863
                            2.1037 0.0877 1.0388-2.9299 1.8472-2.8364
                            0 0-0.51702 4.0991 1.935 5.2227z"></path>
                        </g>
                    </svg>
                </div>
            </div>
            {vm.selected &&
                <Editor vm={vm} />
            }

            <ul>
                <CSSTransitionGroup
                    transitionName="animate-add-remove"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {vm.children.map((child) => (
                        <Claim key={child.argument.ver} vm={child} />
                    ))}
                </CSSTransitionGroup>

            </ul>
        </div>
    );
}

export default Claim;