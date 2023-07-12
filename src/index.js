import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import './style/index.less';
import { store, pStore } from './store/index.js';
import { PersistGate } from 'redux-persist/lib/integration/react';

//Remove all console.* statements
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
      <PersistGate loading={null} persistor={pStore}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

