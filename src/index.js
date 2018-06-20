import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const claims = document.getElementsByTagName('claim');

for (const claim of claims) {
  ReactDOM.render(<App
    claimId={claim.getAttribute('claimId')}
    claimData={claim.getAttribute('claimData')}
        />, claim);
}

// ReactDOM.render(<App />, Element.getElementsByTagName("claim"));
registerServiceWorker();
