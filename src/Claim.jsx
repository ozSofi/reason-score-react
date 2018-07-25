import React from 'react';
import Editor from './Editor';
import { CSSTransitionGroup } from 'react-transition-group';

function Claim(props) {
    const vm = props.vm;
    return (
        <div className={'claim-outer'}>
            <div className={vm.className}>
                <div className={'increase triangle'} onClick={vm.increase}>
                    {Triangle()}
                </div>
                <div className={'decrease triangle'}  onClick={vm.decrease}>
                    {Triangle()}
                </div>
                <div className={'claim-inner'}  onClick={vm.onSelect}>
                    <span className={`score`}>
                        {vm.display}
                    </span>
                    <span>
                        {vm.content}
                    </span>
                </div>
            {Callout()}
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

    function Callout() {
        return (
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
        );
    }

    function Triangle () {
        return (
            <svg viewBox="0 0 15 15">
                <g>
                    <path d="M 7.5,2 13,7.5 V 13 H 2 V 7.5 ZZ" />
                    <path d="M 10,8.5 H 5" />
                    <path className={'v-bar'} d="M 7.5,11 V 6" />
                </g>
            </svg>
        )
    }

      
}

export default Claim;