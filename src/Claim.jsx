import React from 'react';
import Editor from './Editor';
import { CSSTransitionGroup } from 'react-transition-group';

function Claim(props) {
    const vm = props.vm;
    return (
        <div className={'claim-outer'}>
            <div className={vm.className}>
                <span className={'increase'} onClick={vm.increase}>
                    +
                <div className={'triangle'} >
                    <svg viewBox="0 0 10 10">
                        <g transform="translate(0,-294.35417)" >
                            <path d="m 4.8895982,295.27338 c -0.4794418,0.0287 -0.9133838,0.32638 -1.1532985,0.79116 l -2.6686654,5.16581 c -0.54593511,1.05702 0.1364035,2.37819 1.2284884,2.37865 h 5.3373309 c 1.0925991,5.3e-4 1.7758376,-1.32114 1.2296454,-2.37865 l -2.6698225,-5.16581 c -0.2667947,-0.51678 -0.7705476,-0.82249 -1.3036783,-0.79116 z"/>
                        </g>
                    </svg>
                </div>
                </span>
                <span className={'decrease'}  onClick={vm.decrease}>
                    -
                    <div className={'triangle'} >
                    <svg viewBox="0 0 10 10">
                        <g transform="translate(0,-294.35417)" >
                            <path d="m 4.8895982,295.27338 c -0.4794418,0.0287 -0.9133838,0.32638 -1.1532985,0.79116 l -2.6686654,5.16581 c -0.54593511,1.05702 0.1364035,2.37819 1.2284884,2.37865 h 5.3373309 c 1.0925991,5.3e-4 1.7758376,-1.32114 1.2296454,-2.37865 l -2.6698225,-5.16581 c -0.2667947,-0.51678 -0.7705476,-0.82249 -1.3036783,-0.79116 z"/>
                        </g>
                    </svg>
                </div>
                </span>
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
}

export default Claim;