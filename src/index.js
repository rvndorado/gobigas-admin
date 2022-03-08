import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './index.scss';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import allReducers from './reducers/index';
import { Provider } from 'react-redux';

const middleware = [
  thunk,
];
const store = createStore(allReducers, composeWithDevTools(
  applyMiddleware(...middleware),
));


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

