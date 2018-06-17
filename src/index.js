import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
//debugger;
const claims = document.getElementsByTagName("claim");

for (const claim of claims){
    ReactDOM.render(<App
        claimId={claim.getAttribute("claimId")}
        claimData={claim.getAttribute("claimData")}
        />, claim);
}

//ReactDOM.render(<App />, Element.getElementsByTagName("claim"));
registerServiceWorker();
